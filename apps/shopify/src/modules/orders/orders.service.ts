import { InstalledApp, OauthService } from '@juicyllama/app-store'
import { Store, StoresService, Transaction, TransactionsService } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { Shopify } from '@shopify/shopify-api'
import { ShopifySession } from '../../config/shopify.config'
import { InjectShopify } from '../provider/provider.constants'
import { ShopifyOrder, ShopifyRestListOrders } from './orders.dto'
import { ShopifyOrdersMapperService } from './orders.mapper.service'

@Injectable()
export class ShopifyOrdersService {
	constructor(
		private readonly logger: Logger,
		@InjectShopify() private readonly shopify: Shopify,
		private readonly oauthService: OauthService,
		private readonly transactionsService: TransactionsService,
		private readonly storesService: StoresService,
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

		const orders: ShopifyOrder[] = []
		let pageInfo

		const client = new this.shopify.clients.Rest({
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

		const transactions: Transaction[] = []

		if (orders?.length === 0) return transactions

		for (const order of orders) {
			let transaction = await this.transactionsService.findOne({
				where: { store_id: store?.store_id, order_id: order.id.toString() },
			})

			if (!transaction) {
				if (!store) {
					throw new Error(`Store must be provided to create a new transaction`)
				}
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
