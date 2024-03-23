import { Transaction } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Controller, Query, Body, Post, forwardRef, Inject } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'

@Controller('app/shopify/customers')
export class ShopifyCustomersController {
	constructor(
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
	) {}

	/**
	 * This endpoint is used for shopify to show customer data (GDPR)
	 */

	@ApiHideProperty()
	@Post('/webhook/data_request')
	async webhookDataRequest(
		@Query('installed_app_id') installed_app_id: number,
		@Body() data: any, //todo type this
	): Promise<Transaction | null> {
		const domain = 'app::shopify::customers::controller::webhookDataRequest'

		this.logger.error(`[${domain}] Customer Data Request`, {
			installed_app_id: installed_app_id,
			data: data,
		})

		//todo find contact and alert client (how?!?)

		return null
	}

	/**
	 * This endpoint is used for shopify to redact the customer data (GDPR)
	 */

	@ApiHideProperty()
	@Post('/webhook/redact')
	async webhookRedact(
		@Query('installed_app_id') installed_app_id: number,
		@Body() data: any, //todo type this
	): Promise<Transaction | null> {
		const domain = 'app::shopify::customers::controller::webhookRedact'

		this.logger.error(`[${domain}] Redact Customer`, {
			installed_app_id: installed_app_id,
			data: data,
		})

		//todo find contact and delete data

		return null
	}
}
