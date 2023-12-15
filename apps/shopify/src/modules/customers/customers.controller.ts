import { InstalledAppsService } from '@juicyllama/app-store'
import { Transaction } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Controller, Query, Body, Post } from '@nestjs/common'
import { ApiHideProperty } from '@nestjs/swagger'
import { ShopifyCustomersService } from './customers.service'

@Controller('app/shopify/customers')
export class ShopifyCustomersController {
	constructor(
		private readonly logger: Logger,
		private readonly shopifyShopService: ShopifyCustomersService,
		private readonly installedAppsService: InstalledAppsService,
	) {}

	/**
	 * This endpoint is used for shopify to show customer data (GDPR)
	 */

	@ApiHideProperty()
	@Post('/webhook/data_request')
	async webhookDataRequest(
		@Query('installed_app_id') installed_app_id: number,
		@Body() data: any, //todo type this
	): Promise<Transaction> {
		const domain = 'app::shopify::customers::controller::webhookDataRequest'

		this.logger.error(`[${domain}] Customer Data Request`, {
			installed_app_id: installed_app_id,
			data: data,
		})

		//todo find contact and alert client (how?!?)

		return
	}

	/**
	 * This endpoint is used for shopify to redact the customer data (GDPR)
	 */

	@ApiHideProperty()
	@Post('/webhook/redact')
	async webhookRedact(
		@Query('installed_app_id') installed_app_id: number,
		@Body() data: any, //todo type this
	): Promise<Transaction> {
		const domain = 'app::shopify::customers::controller::webhookRedact'

		this.logger.error(`[${domain}] Redact Customer`, {
			installed_app_id: installed_app_id,
			data: data,
		})

		//todo find contact and delete data

		return
	}
}
