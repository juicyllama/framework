import { CronGuard, CronRunner } from '@juicyllama/core'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { ShopifyOrdersCronService } from './orders.cron.service'
import { CRON_APP_SHOPIFY_SYNC_ORDERS_DOMIN } from './orders.constants'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('app/shopify/crons/orders')
export class ShopifyOrdersCronController {
	constructor(private readonly shopifyOrdersCronService: ShopifyOrdersCronService) {}

	@Post('sync')
	async syncOrders() {
		return await CronRunner(CRON_APP_SHOPIFY_SYNC_ORDERS_DOMIN, this.shopifyOrdersCronService.syncOrders())
	}
}
