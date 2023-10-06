import { Controller, forwardRef, Inject, Get, Query, Body, Post } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { Logger } from '@juicyllama/utils'
import { InstalledAppsService, Oauth } from '@juicyllama/app-store'
import { AccountId, UserAuth } from '@juicyllama/core'
import { ShopifyWebhooksService } from './webhooks.service'
import { ApiVersion } from '@shopify/shopify-api'
import { ShopifyWebhookCreate } from './webhooks.dto'

@Controller('app/shopify/webhooks')
export class ShopifyWebhooksController {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ShopifyWebhooksService))
		private readonly shopifyWebhooksService: ShopifyWebhooksService,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly installedAppsService: InstalledAppsService,
	) {}

	@UserAuth()
	@ApiHideProperty()
	@Post('create')
	async create(
		@Query('installed_app_id') installed_app_id: number,
		@AccountId() account_id: string,
		@Body() data: ShopifyWebhookCreate,
	): Promise<Oauth> {
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

		return await this.shopifyWebhooksService.createWebhook(installed_app, { api_version: ApiVersion.April23 }, data)
	}

	@UserAuth()
	@ApiHideProperty()
	@Get('list')
	async list(
		@Query('installed_app_id') installed_app_id: number,
		@AccountId() account_id: string,
		@Query() query: any,
	): Promise<Oauth> {
		const domain = 'app::shopify::webhooks::controller::list'

		this.logger.log(`[${domain}] Find Webhooks`, {
			installed_app_id: installed_app_id,
			account_id: account_id,
		})

		const installed_app = await this.installedAppsService.findOne({
			where: { account_id: account_id, installed_app_id: installed_app_id },
		})

		if (!installed_app) throw new Error(`[${domain}] Installed App not found`)

		delete query.installed_app_id

		return await this.shopifyWebhooksService.getWebhooks(installed_app, {
			api_version: ApiVersion.April23,
			...query,
		})
	}
}
