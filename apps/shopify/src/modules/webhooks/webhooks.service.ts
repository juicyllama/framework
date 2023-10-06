import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Shopify, ShopifySession } from '../../config/shopify.config'
import { Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { InstalledApp, OauthService } from '@juicyllama/app-store'
import { ShopifyRestListWebhooks, ShopifyWebhook, ShopifyWebhookCreate } from './webhooks.dto'
import { ShopifyRest } from '../shopify.common.dto'

@Injectable()
export class ShopifyWebhooksService {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => OauthService)) private readonly oauthService: OauthService,
	) {}

	async createWebhook(installed_app: InstalledApp, options: ShopifyRest, data: ShopifyWebhookCreate): Promise<any> {
		const domain = 'app::shopify::webhook::getWebhooks'

		const shopify = Shopify(this.configService.get('shopify'))
		const oath = await this.oauthService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })
		const session = ShopifySession(installed_app, oath)

		const client = new shopify.clients.Rest({
			session,
			apiVersion: options.api_version,
		})

		data.address = `${data.address}?installed_app_id=${installed_app.installed_app_id}`

		const response = <any>await client.post({
			path: 'webhooks',
			data: {
				webhook: {
					format: 'json',
					...data,
				},
			},
		})

		const webhook: ShopifyWebhook = response.body?.webhook

		this.logger.log(`[${domain}] Webhook created`, webhook)

		return webhook
	}

	async getWebhooks(installed_app: InstalledApp, options: ShopifyRestListWebhooks): Promise<any> {
		const domain = 'app::shopify::webhook::getWebhooks'

		const shopify = Shopify(this.configService.get('shopify'))
		const oath = await this.oauthService.findOne({ where: { installed_app_id: installed_app.installed_app_id } })
		const session = ShopifySession(installed_app, oath)

		const client = new shopify.clients.Rest({
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
}
