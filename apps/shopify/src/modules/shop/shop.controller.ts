import { Transaction } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Controller, Query, Body, Post, forwardRef, Inject } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'

@Controller('app/shopify/shop')
export class ShopifyShopController {
	constructor(@Inject(forwardRef(() => Logger)) readonly logger: Logger) {}

	/**
	 * This endpoint is used for shopify to redact the shop
	 */

	@ApiHideProperty()
	@Post('/webhook/redact')
	async webhookRedact(
		@Query('installed_app_id') installed_app_id: number,
		@Body() data: any, //todo type this
	): Promise<Transaction | null> {
		const domain = 'app::shopify::shop::controller::webhookRedact'

		this.logger.error(`[${domain}] Redact Shop`, {
			installed_app_id: installed_app_id,
			data: data,
		})

		return null
	}
}
