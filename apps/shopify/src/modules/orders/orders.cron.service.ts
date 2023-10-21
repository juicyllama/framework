import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { LessThan, IsNull } from 'typeorm'
import { AppStoreIntegrationName, InstalledAppsService, AppIntegrationStatus } from '@juicyllama/app-store'
import { CronRunner } from '@juicyllama/core'
import { Cron, CronExpression } from '@nestjs/schedule'
import { StoresService } from '@juicyllama/ecommerce'
import { ShopifyOrdersService } from './orders.service'
import { ApiVersion } from '@shopify/shopify-api'
import _ from 'lodash'

@Injectable()
export class ShopifyOrdersCronService {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly installedAppsService: InstalledAppsService,
		@Inject(forwardRef(() => ShopifyOrdersService)) private readonly shopifyOrdersService: ShopifyOrdersService,
		@Inject(forwardRef(() => StoresService)) private readonly storesService: StoresService,
	) {}

	@Cron(CronExpression.EVERY_10_MINUTES, { disabled: !process.env.CRON_APP_SHOPIFY_SYNC_ORDERS })
	async cronSyncOrders() {
		const domain = 'app::shopify::orders::crons::getOrders'
		return await CronRunner(domain, await this.syncOrders())
	}

	async syncOrders(): Promise<any> {
		const domain = 'app::shopify::orders::getOrders'

		const installed_apps = await this.installedAppsService.findAll({
			where: [
				{
					app: {
						integration_name: AppStoreIntegrationName.shopify,
					},
					integration_status: AppIntegrationStatus.CONNECTED,
					active: true,
					next_check_at: LessThan(new Date()),
				},
				{
					app: {
						integration_name: AppStoreIntegrationName.shopify,
					},
					integration_status: AppIntegrationStatus.CONNECTED,
					active: true,
					next_check_at: IsNull(),
				},
			],
			order: {
				next_check_at: 'ASC',
			},
		})

		this.logger.log(`[${domain}] ${installed_apps.length} Shopify Apps Need Syncing`)

		const shopifyPromises = []
		let order_count = 0

		for (const installed_app of installed_apps) {
			const shopifyPromise = new Promise((res, rej) => {
				this.storesService
					.findOne({ where: { installed_app_id: installed_app.installed_app_id } })
					.then(store => {
						if (!store) {
							this.logger.error(`[${domain}] Store not found`, {
								installed_app_id: installed_app.installed_app_id,
							})
							rej(new Error(`Store not found for installed app ${installed_app.installed_app_id}`))
						}
						const last_check_at = new Date()

						const options = <any>_.omitBy({
							api_version: ApiVersion.July23,
							status: 'any',
							updated_at_min: installed_app.last_check_at ?? null
						}, _.isNil)

						this.shopifyOrdersService
							.syncOrders(
								installed_app,
								options,
								store,
							)
							.then(orders => {
								order_count += orders.length

								this.logger.log(
									`[${domain}] ${orders.length} Orders synced for store: ${installed_app.settings.SHOPIFY_SHOP_NAME}`,
									{
										installed_app_id: installed_app.installed_app_id,
										account_id: installed_app.account_id,
									},
								)

								this.installedAppsService
									.update({
										installed_app_id: installed_app.installed_app_id,
										last_check_at: last_check_at,
										next_check_at: new Date(new Date().getTime() + 1000 * 60 * 10), // 10 minutes
									})
									.then(() => {
										res(`${orders.length} Orders synced`)
									})
									.catch(err => {
										this.logger.warn(`[${domain}] Error updating installed app`, {
											installed_app_id: installed_app.installed_app_id,
											error: err,
										})
										rej(err)
									})
							})
							.catch(err => {
								this.logger.warn(
									`[${domain}] Error syncing orders for store: ${installed_app.settings.SHOPIFY_SHOP_NAME}`,
									{
										installed_app_id: installed_app.installed_app_id,
										store: store,
										error: err,
									},
								)
								rej(err)
							})
					})
					.catch(err => {
						this.logger.warn(`[${domain}] Error looking up store`, {
							installed_app_id: installed_app.installed_app_id,
							error: err,
						})
						rej(err)
					})
			})

			shopifyPromises.push(shopifyPromise)
		}

		await Promise.all(shopifyPromises)

		return {
			shopify: {
				installed_apps: installed_apps.length,
				orders: order_count,
				success: shopifyPromises.filter(o => o.status === 'fulfilled').length,
				failed: shopifyPromises.filter(o => o.status === 'rejected').length,
				failures: shopifyPromises.filter(o => o.status === 'rejected'),
			},
		}
	}
}
