import { Controller, forwardRef, Post, Inject, Query } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { UserAuth, AccountId } from '@juicyllama/core'
import { InstalledAppsService } from '@juicyllama/app-store'
import { AmazonSellerOrdersService } from '../modules/orders/amazon.seller.orders.service'
import { AmazonSellerFullOrderDto } from '../modules/orders/amazon.seller.order.dto'

@Controller(`/orders`)
export class OrdersController {
	constructor(
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
		@Inject(forwardRef(() => AmazonSellerOrdersService))
		readonly amazonSellerOrdersService: AmazonSellerOrdersService,
		@Inject(forwardRef(() => InstalledAppsService)) readonly installedAppsService: InstalledAppsService,
	) {}

	@UserAuth()
	@Post()
	async getOrders(@AccountId() account_id: number, @Query() query: any): Promise<AmazonSellerFullOrderDto[]> {
		
		console.log('Running....')
		
		const installed_app = await this.installedAppsService.findOne({
			where: {
				installed_app_id: query.installed_app_id,
				account_id: account_id,
			},
		})

		return await this.amazonSellerOrdersService.findMany(installed_app)
	}
}
