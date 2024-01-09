import { InstalledApp, OauthService } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { ApiVersion, Shopify } from '@shopify/shopify-api'
import { ShopifySession } from '../../config/shopify.config'
import { InjectShopify } from '../provider/provider.constants'
import { ShopifyRest } from '../shopify.common.dto'
import { ShopifyRestListWebhooks, ShopifyWebhook, ShopifyWebhookCreate } from './webhooks.dto'
import { ShopifyWebhooksTopicRoutes, ShopifyWebhooksTopics } from './webhooks.enums'

@Injectable()
export class ShopifyWebhooksService {
	constructor(
		private readonly logger: Logger,
		private readonly oauthService: OauthService,
		@InjectShopify() private readonly shopify: Shopify,
	) {}

	async createWebhook(
		installed_app: InstalledApp,
		options: ShopifyRest,
		data: ShopifyWebhookCreate,
	): Promise<ShopifyWebhook> {
		const domain = 'app::shopify::webhook::getWebhooks'

		const oath = await this.oauthService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })
		const session = ShopifySession(installed_app, oath)

		const client = new this.shopify.clients.Rest({
			session,
			apiVersion: options.api_version,
		})

		const webhooks = await this.getWebhooks(installed_app, { api_version: options.api_version, topic: data.topic })
		let webhook: ShopifyWebhook

		if (webhooks.length) {
			const response = <any>await client.put({
				path: `webhooks/${webhooks[0].id}`,
				data: {
					webhook: {
						address: `${process.env.BASE_URL_API}/${
							ShopifyWebhooksTopicRoutes[data.topic]
						}?installed_app_id=${installed_app.installed_app_id}`,
					},
				},
			})

			webhook = response.body?.webhook

			this.logger.log(`[${domain}] Webhook updated`, {
				id: webhooks[0].id,
			})
		} else {
			const response = <any>await client.post({
				path: 'webhooks',
				data: {
					webhook: {
						format: 'json',
						topic: data.topic,
						address: `${process.env.BASE_URL_API}/${
							ShopifyWebhooksTopicRoutes[data.topic]
						}?installed_app_id=${installed_app.installed_app_id}`,
					},
				},
			})

			webhook = response.body?.webhook
			this.logger.log(`[${domain}] Webhook created`, webhook)
		}

		return webhook
	}

	async getWebhooks(installed_app: InstalledApp, options: ShopifyRestListWebhooks): Promise<ShopifyWebhook[]> {
		const domain = 'app::shopify::webhook::getWebhooks'

		const oath = await this.oauthService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })
		const session = ShopifySession(installed_app, oath)

		const client = new this.shopify.clients.Rest({
			session,
			apiVersion: options.api_version,
		})

		const response = <any>await client.get({
			path: 'webhooks',
			query: <any>options,
		})

		const webhooks: ShopifyWebhook[] = response.body?.webhooks

		this.logger.log(`[${domain}] ${webhooks.length} Webhooks found`)

		return webhooks
	}

	/**
	 * Helper to register all Order related webhooks for a shopify store
	 */

	async registerOrderWebhooks(installed_app: InstalledApp): Promise<ShopifyWebhook[]> {
		const topics = [
			ShopifyWebhooksTopics['orders/create'],
			ShopifyWebhooksTopics['orders/cancelled'],
			ShopifyWebhooksTopics['orders/edited'],
			ShopifyWebhooksTopics['orders/fulfilled'],
			ShopifyWebhooksTopics['orders/paid'],
			ShopifyWebhooksTopics['orders/partially_fulfilled'],
			ShopifyWebhooksTopics['orders/updated'],
		]

		const results = []

		for (const topic of topics) {
			results.push(await this.createWebhook(installed_app, { api_version: ApiVersion.July23 }, { topic: topic }))
		}

		return results
	}
}
