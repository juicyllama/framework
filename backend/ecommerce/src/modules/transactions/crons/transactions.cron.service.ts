import { AppStoreIntegrationName, InstalledAppsService, AppIntegrationStatus } from '@juicyllama/app-store'
import { CronRunner } from '@juicyllama/core'
import { Logger, Modules } from '@juicyllama/utils'
import { Injectable, forwardRef, Inject } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ApiVersion } from '@shopify/shopify-api'
import _ from 'lodash'
import { LessThan, IsNull, In } from 'typeorm'
import { CRON_ECOMMERCE_TRANSACTIONS_SYNC_DOMAIN } from './transactions.constants'
import { StoresService } from '../../stores/stores.service'
import { LazyModuleLoader } from '@nestjs/core'
import { TransactionsShopifyMapperService } from './mappers/shopify/transactions.service'

@Injectable()
export class SyncTransactionsCronService {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly installedAppsService: InstalledAppsService,
		@Inject(forwardRef(() => StoresService)) private readonly storesService: StoresService,
		@Inject(forwardRef(() => LazyModuleLoader)) private readonly lazyModuleLoader: LazyModuleLoader,
		@Inject(forwardRef(() => TransactionsShopifyMapperService))
		private readonly transactionsShopifyMapperService: TransactionsShopifyMapperService,
	) {}

	@Cron(process.env.CRON_ECOMMERCE_TRANSACTIONS_SYNC_FREQUENCY ?? CronExpression.EVERY_10_MINUTES, {
		disabled: !process.env.CRON_ECOMMERCE_TRANSACTIONS_SYNC,
	})
	async cronSyncOrders() {
		return await CronRunner(CRON_ECOMMERCE_TRANSACTIONS_SYNC_DOMAIN, this.syncTransactions())
	}

	async syncTransactions(): Promise<any> {
		const domain = CRON_ECOMMERCE_TRANSACTIONS_SYNC_DOMAIN

		const installed_apps = await this.installedAppsService.findAll({
			where: [
				{
					app: {
						integration_name: In([AppStoreIntegrationName.shopify]),
					},
					integration_status: AppIntegrationStatus.CONNECTED,
					active: true,
					next_check_at: LessThan(new Date()),
				},
				{
					app: {
						integration_name: In([AppStoreIntegrationName.shopify]),
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

		this.logger.log(`[${domain}] ${installed_apps.length} Apps Need Syncing`)

		const appPromises = []
		let order_count = 0

		for (const installed_app of installed_apps) {
			const appPromise = new Promise(async (res, rej) => {
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

					switch (installed_app.app?.integration_name) {
						case AppStoreIntegrationName.shopify:
							if (!Modules.shopify.isInstalled) {
								this.logger.error(`[${domain}] Shopify module not installed`)
								rej(new Error(`Shopify module not installed`))
							}

							const { ShopifyOrdersModule, ShopifyOrdersService } = await Modules.shopify.load()

							const shopifyOrdersModule = await this.lazyModuleLoader.load(() => ShopifyOrdersModule)
							const shopifyOrdersService = shopifyOrdersModule.get(ShopifyOrdersService)

							const options = <any>_.omitBy(
								{
									api_version: ApiVersion.January24,
									status: 'any',
									updated_at_min: installed_app.last_check_at ?? null,
								},
								_.isNil,
							)

							const orders = await shopifyOrdersService.listOrders(installed_app, options)

							for (const order of orders) {
								await this.transactionsShopifyMapperService.pushTransaction(order, store, installed_app)
							}

							order_count += orders.length

							this.logger.log(
								`[${domain}] ${orders.length} Orders synced for store: ${installed_app.settings.SHOPIFY_SHOP_NAME}`,
								{
									installed_app_id: installed_app.installed_app_id,
									account_id: installed_app.account_id,
								},
							)

							res(`${orders.length} Orders synced`)
					}
				} catch (err) {
					rej(err)
				}
			})

			appPromises.push(appPromise)
		}

		const promiseResults = await Promise.allSettled(appPromises)

		return {
			installed_apps: installed_apps.length,
			orders: order_count,
			success: promiseResults.filter(o => o.status === 'fulfilled').length,
			failed: promiseResults.filter(o => o.status === 'rejected').length,
			failures: promiseResults
				.filter((rej: PromiseSettledResult<unknown>) => rej.status === 'rejected')
				.map((rej: PromiseSettledResult<unknown>) => (rej as PromiseRejectedResult).reason),
		}
	}
}
