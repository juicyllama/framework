// import { Controller, forwardRef, Inject, Post, Req, UseGuards } from '@nestjs/common'
// import { CronGuard } from '@/api/auth/guards/cron.guard'
// import { ApiExcludeController } from '@nestjs/swagger'
// import { AmazonSellerCronService } from '@/apps/amazon_seller/cron/amazon.seller.cron.service'

// const app = 'amazon_seller'

// @Controller(`/crons/apps/${app}`)
// @ApiExcludeController()
// export class AmazonSellerCronController {
// 	constructor(
// 		@Inject(forwardRef(() => AmazonSellerCronService)) private readonly amazonSellerCronService: AmazonSellerCronService)
// 	{}

// 	@UseGuards(CronGuard)
// 	@Post()
// 	async run(@Req() req): Promise<void> {
// 		return await this.amazonSellerCronService.run()
// 	}
// }
