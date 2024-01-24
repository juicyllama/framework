import { AppStoreIntegrationName, InstalledAppsService, AppIntegrationStatus } from '@juicyllama/app-store'
import { CronRunner } from '@juicyllama/core'
import { StoresService } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ApiVersion } from '@shopify/shopify-api'
import _ from 'lodash'
import { LessThan, IsNull } from 'typeorm'
import { ShopifyOrdersService } from './orders.service'
import { CRON_APP_SHOPIFY_SYNC_ORDERS_DOMIN } from './orders.constants'

@Injectable()
export class ShopifyOrdersCronService {
	constructor(
		private readonly logger: Logger,
		private readonly installedAppsService: InstalledAppsService,
		private readonly shopifyOrdersService: ShopifyOrdersService,
		private readonly storesService: StoresService,
	) {}

	@Cron(process.env.CRON_APP_SHOPIFY_SYNC_ORDERS_FREQUENCY ?? CronExpression.EVERY_10_MINUTES, {
		disabled: !process.env.CRON_APP_SHOPIFY_SYNC_ORDERS,
	})
	async cronSyncOrders() {
		return await CronRunner(CRON_APP_SHOPIFY_SYNC_ORDERS_DOMIN, this.syncOrders())
	}

	async syncOrders(): Promise<any> {
		const domain = CRON_APP_SHOPIFY_SYNC_ORDERS_DOMIN

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
			const shopifyPromise = new Promise(async (res, rej) => {
				try {
					const store = await this.storesService
						.findOne({ where: { installed_app_id: installed_app.installed_app_id } })
						.catch(err => {
							this.logger.warn(`[${domain}] Error looking up store`, {
								installed_app_id: installed_app.installed_app_id,
								error: err,
							})
							throw err
						})
					if (!store) {
						this.logger.error(`[${domain}] Store not found`, {
							installed_app_id: installed_app.installed_app_id,
						})
						rej(new Error(`Store not found for installed app ${installed_app.installed_app_id}`))
					}

					const updateRunTimes = {
						installed_app_id: installed_app.installed_app_id,
						last_check_at: new Date(),
						next_check_at: new Date(new Date().getTime() + 1000 * 60 * 10), // 10 minutes
					}

					await this.installedAppsService.update(updateRunTimes).catch(err => {
						this.logger.warn(`[${domain}] Error updating installed app`, {
							installed_app_id: installed_app.installed_app_id,
							error: err,
						})
						throw err
					})
					this.logger.log(`[${domain}] Installed App Runtimes Updated`, updateRunTimes)

					const options = <any>_.omitBy(
						{
							api_version: ApiVersion.July23,
							status: 'any',
							updated_at_min: installed_app.last_check_at ?? null,
						},
						_.isNil,
					)

					const orders = await this.shopifyOrdersService
						.syncOrders(installed_app, options, store)
						.catch(err => {
							this.logger.warn(
								`[${domain}] Error syncing orders for store: ${installed_app.settings.SHOPIFY_SHOP_NAME}`,
								{
									installed_app_id: installed_app.installed_app_id,
									store: store,
									error: err,
								},
							)
							throw err
						})

					order_count += orders.length

					this.logger.log(
						`[${domain}] ${orders.length} Orders synced for store: ${installed_app.settings.SHOPIFY_SHOP_NAME}`,
						{
							installed_app_id: installed_app.installed_app_id,
							account_id: installed_app.account_id,
						},
					)

					res(`${orders.length} Orders synced`)
				} catch (err) {
					rej(err)
				}
			})

			shopifyPromises.push(shopifyPromise)
		}

		const promiseResults = await Promise.allSettled(shopifyPromises)

		return {
			shopify: {
				installed_apps: installed_apps.length,
				orders: order_count,
				success: promiseResults.filter(o => o.status === 'fulfilled').length,
				failed: promiseResults.filter(o => o.status === 'rejected').length,
				failures: promiseResults
					.filter((rej: PromiseSettledResult<unknown>) => rej.status === 'rejected')
					.map((rej: PromiseSettledResult<unknown>) => (rej as PromiseRejectedResult).reason),
			},
		}
	}
}
