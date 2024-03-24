import { InstalledApp, OauthService } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Injectable, forwardRef, Inject } from '@nestjs/common'
import { Shopify } from '@shopify/shopify-api'
import { ShopifySession } from '../../config/shopify.config'
import { InjectShopify } from '../provider/provider.constants'
import { ShopifyOrder, ShopifyRestListOrders } from './orders.dto'

@Injectable()
export class ShopifyOrdersService {
	constructor(
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
		@InjectShopify() private readonly shopify: Shopify,
		@Inject(forwardRef(() => OauthService)) readonly oauthService: OauthService,
	) {}

	/**
	 * Returns a list of orders from Shopify based on the options provided
	 */

	async listOrders(installed_app: InstalledApp, options: ShopifyRestListOrders): Promise<ShopifyOrder[]> {
		const domain = 'app::shopify::orders::listOrders'

		const oath = await this.oauthService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })

		if (!oath) {
			this.logger.error(`[${domain}] Oauth not found`, {
				installed_app_id: installed_app.installed_app_id,
			})
			throw new Error(`Oauth not found`)
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
}
