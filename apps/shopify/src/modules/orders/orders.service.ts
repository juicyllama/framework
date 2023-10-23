import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Shopify, ShopifySession } from '../../config/shopify.config'
import { Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { InstalledApp, OauthService } from '@juicyllama/app-store'
import { ShopifyOrder, ShopifyRestListOrders } from './orders.dto'
import { Store, StoresService, Transaction, TransactionsService } from '@juicyllama/ecommerce'
import { ShopifyOrdersMapperService } from './orders.mapper.service'

@Injectable()
export class ShopifyOrdersService {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => OauthService)) private readonly oauthService: OauthService,
		@Inject(forwardRef(() => TransactionsService)) private readonly transactionsService: TransactionsService,
		@Inject(forwardRef(() => StoresService)) private readonly storesService: StoresService,
		@Inject(forwardRef(() => ShopifyOrdersMapperService))
		private readonly mapperService: ShopifyOrdersMapperService,
	) {}

	/**
	 * Returns a list of orders from Shopify based on the options provided
	 */

	async listOrders(
		installed_app: InstalledApp,
		options: ShopifyRestListOrders,
		store?: Store,
	): Promise<ShopifyOrder[]> {
		const domain = 'app::shopify::orders::listOrders'

		const shopify = Shopify(this.configService.get('shopify'))
		const oath = await this.oauthService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })

		if (!oath) {
			this.logger.error(`[${domain}] Oauth not found`, {
				installed_app_id: installed_app.installed_app_id,
			})
			throw new Error(`Oauth not found`)
		}

		if (!store) {
			store = await this.storesService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })
		}

		if (!store) {
			this.logger.error(`[${domain}] Store not found`, {
				installed_app_id: installed_app.installed_app_id,
			})
			throw new Error(`Store not found`)
		}

		const session = ShopifySession(installed_app, oath)

		const orders = <ShopifyOrder[]>[]
		let pageInfo

		const client = new shopify.clients.Rest({
			session,
			apiVersion: options.api_version,
		})

		let response = <any>await client.get({
			path: 'orders',
			query: <any>options,
		})

		orders.push(...response.body.orders)
		pageInfo = response.pageInfo

		if (pageInfo?.nextPage) {
			do {
				this.logger.log(`[${domain}] ${orders.length} Orders added, fetching next page`)

				response = <any>await client.get({
					path: 'orders',
					query: {
						...response.pageInfo?.nextPage?.query,
						limit: options.limit ?? 50,
					},
				})

				orders.push(...response.body.orders)
				pageInfo = response.pageInfo
			} while (pageInfo?.nextPage)
		}

		this.logger.log(`[${domain}] ${orders.length} Orders found`)

		return orders
	}

	/**
	 * Creates or updates ecommerce transactions from a list of shopify orders fetched from shopify based on the options provided
	 */

	async syncOrders(
		installed_app: InstalledApp,
		options: ShopifyRestListOrders,
		store?: Store,
	): Promise<Transaction[]> {
		const orders = await this.listOrders(installed_app, options, store)

		const transactions = []

		for (const order of orders) {
			let transaction = await this.transactionsService.findOne({
				where: { store_id: store.store_id, order_id: order.id.toString() },
			})

			if (!transaction) {
				transaction = await this.mapperService.createEcommerceTransaction(order, store, installed_app)
			} else {
				transaction = await this.mapperService.updateEcommerceTransaction(transaction, order)
			}

			transactions.push(transaction)
		}

		return transactions
	}

	/**
	 * Creates and returns an ecommerce transaction from a shopify order
	 */

	async addOrUpdateOrder(installed_app: InstalledApp, order: ShopifyOrder): Promise<Transaction> {
		const domain = 'app::shopify::orders::addOrder'

		const store = await this.storesService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })

		if (!store) {
			this.logger.error(`[${domain}] Store not found`, {
				installed_app_id: installed_app.installed_app_id,
			})
			throw new Error(`Store not found`)
		}

		let transaction = await this.transactionsService.findOne({
			where: { store_id: store.store_id, order_id: order.id.toString() },
		})

		if (!transaction) {
			transaction = await this.mapperService.createEcommerceTransaction(order, store, installed_app)
		} else {
			transaction = await this.mapperService.updateEcommerceTransaction(transaction, order)
		}

		return transaction
	}
}
