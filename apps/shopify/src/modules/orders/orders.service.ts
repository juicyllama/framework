import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Shopify, ShopifySession }from '../../config/shopify.config'
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
		@Inject(forwardRef(() => ShopifyOrdersMapperService)) private readonly mapperService: ShopifyOrdersMapperService,
	) {}

	async syncOrders(installed_app: InstalledApp, options: ShopifyRestListOrders, store?: Store ) : Promise<Transaction[]> {

		const orders = await this.listOrders(installed_app, options, store)

		const transactions = []

		for (const order of orders) {
			let transaction = await this.transactionsService.findOne({ where: { store_id: store.store_id, order_id: order.id.toString() } })

			if (!transaction) {
				transaction = await this.mapperService.createEcommerceTransaction(order, store.account_id, store.store_id)
			}else{
				transaction = await this.mapperService.updateEcommerceTransaction(transaction, order)
			}
			
			transactions.push(transaction)
		}

		return transactions
	}

	async addOrder(installed_app: InstalledApp, order: ShopifyOrder): Promise<Transaction> {
		const domain = 'app::shopify::orders::addOrder'

		const store = await this.storesService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })

		if(!store) {
			this.logger.error(`[${domain}] Store not found`, {
				installed_app_id: installed_app.installed_app_id, 
			})
			throw new Error(`Store not found`)
		}

		return await this.mapperService.createEcommerceTransaction(order, store.account_id, store.store_id)

	}

	async listOrders(installed_app: InstalledApp, options: ShopifyRestListOrders, store?: Store ) : Promise<ShopifyOrder[]> {
		const domain = 'app::shopify::orders::listOrders'

		const shopify = Shopify(this.configService.get('shopify'))
		const oath = await this.oauthService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })

		if(!oath) {
			this.logger.error(`[${domain}] Oauth not found`, {
				installed_app_id: installed_app.installed_app_id, 
			})
			throw new Error(`Oauth not found`)
		}

		if(!store){
			store = await this.storesService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })
		}

		if(!store) {
			this.logger.error(`[${domain}] Store not found`, {
				installed_app_id: installed_app.installed_app_id, 
			})
			throw new Error(`Store not found`)
		}

		const session = ShopifySession(installed_app, oath)

		const client = new shopify.clients.Rest({    
			session,
			apiVersion: options.api_version
		})

		const response = <any>await client.get({
			path: 'orders',
			query: <any>options
		})

		const orders: ShopifyOrder[] = response.body?.orders
		
		this.logger.log(`[${domain}] ${orders.length} Orders found`)

		return orders
	}



}
