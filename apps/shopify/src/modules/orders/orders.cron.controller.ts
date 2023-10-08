import { Controller, forwardRef, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { CronGuard } from '@juicyllama/core'
import { ShopifyOrdersCronService } from './orders.cron.service'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('app/shopify/crons/orders')
export class ShopifyOrdersCronController {
	constructor(
		@Inject(forwardRef(() => ShopifyOrdersCronService))
		private readonly shopifyOrdersCronService: ShopifyOrdersCronService,
	) {}

	@Post('sync')
	async syncOrders(): Promise<any> {
		return await this.shopifyOrdersCronService.syncOrders()
	}
}
