import { Controller, forwardRef, Inject, Query, Body, Post } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { Logger } from '@juicyllama/utils'
import { InstalledAppsService } from '@juicyllama/app-store'
import { Transaction } from '@juicyllama/ecommerce'
import { ShopifyShopService } from './shop.service'

@Controller('app/shopify/shop')
export class ShopifyShopController {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ShopifyShopService)) private readonly shopifyShopService: ShopifyShopService,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly installedAppsService: InstalledAppsService,
	) {}

	/**
	 * This endpoint is used for shopify to redact the shop
	 */

	@ApiHideProperty()
	@Post('/webhook/redact')
	async webhookRedact(
		@Query('installed_app_id') installed_app_id: number,
		@Body() data: any, //todo type this
	): Promise<Transaction> {
		const domain = 'app::shopify::shop::controller::webhookRedact'

		this.logger.error(`[${domain}] Redact Shop`, {
			installed_app_id: installed_app_id,
			data: data,
		})

		return
	}
}
