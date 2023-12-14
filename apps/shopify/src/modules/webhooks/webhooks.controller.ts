import { InstalledAppsService } from '@juicyllama/app-store'
import { AccountId, UserAuth } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Controller, Get, Query, Body, Post } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { ApiVersion } from '@shopify/shopify-api'
import { ShopifyWebhook, ShopifyWebhookCreate } from './webhooks.dto'
import { ShopifyWebhooksTopics } from './webhooks.enums'
import { ShopifyWebhooksService } from './webhooks.service'

@Controller('app/shopify/webhooks')
export class ShopifyWebhooksController {
	constructor(
		private readonly logger: Logger,
		private readonly shopifyWebhooksService: ShopifyWebhooksService,
		private readonly installedAppsService: InstalledAppsService,
	) {}

	@UserAuth()
	@ApiHideProperty()
	@Post('create')
	async create(
		@Query('installed_app_id') installed_app_id: number,
		@AccountId() account_id: number,
		@Body() data: ShopifyWebhookCreate,
	): Promise<ShopifyWebhook> {
		const domain = 'app::shopify::webhooks::controller::create'

		this.logger.log(`[${domain}] Create Webhook`, {
			installed_app_id: installed_app_id,
			account_id: account_id,
			data: data,
		})

		const installed_app = await this.installedAppsService.findOne({
			where: { account_id: account_id, installed_app_id: installed_app_id },
		})

		if (!installed_app) throw new Error(`[${domain}] Installed App not found`)

		return await this.shopifyWebhooksService.createWebhook(installed_app, { api_version: ApiVersion.July23 }, data)
	}

	@UserAuth()
	@ApiHideProperty()
	@Get('list')
	async list(
		@AccountId() account_id: number,
		@Query()
		{
			installed_app_id,
			topic,
			...query
		}: { installed_app_id: number; topic: ShopifyWebhooksTopics; [key: string]: any },
	): Promise<ShopifyWebhook[]> {
		const domain = 'app::shopify::webhooks::controller::list'

		this.logger.log(`[${domain}] Find Webhooks`, {
			installed_app_id: installed_app_id,
			account_id: account_id,
		})

		const installed_app = await this.installedAppsService.findOne({
			where: { account_id: account_id, installed_app_id: installed_app_id },
		})

		if (!installed_app) throw new Error(`[${domain}] Installed App not found`)

		return await this.shopifyWebhooksService.getWebhooks(installed_app, {
			api_version: ApiVersion.July23,
			topic,
			...query,
		})
	}

	@UserAuth()
	@ApiHideProperty()
	@Post('register/orders/all')
	async registerAllOrdersWebhooks(
		@Query('installed_app_id') installed_app_id: number,
		@AccountId() account_id: number,
	): Promise<ShopifyWebhook[]> {
		const domain = 'app::shopify::webhooks::controller::registerAllOrdersWebhooks'

		this.logger.log(`[${domain}] Register All Order Webhooks`, {
			installed_app_id: installed_app_id,
			account_id: account_id,
		})

		const installed_app = await this.installedAppsService.findOne({
			where: { account_id: account_id, installed_app_id: installed_app_id },
		})

		if (!installed_app) throw new Error(`[${domain}] Installed App not found`)

		return await this.shopifyWebhooksService.registerOrderWebhooks(installed_app)
	}
}
