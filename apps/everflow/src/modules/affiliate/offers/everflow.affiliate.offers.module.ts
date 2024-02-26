import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { EverflowAffiliateOffersService } from './everflow.affiliate.offers.service'

@Module({
	controllers: [],
	providers: [EverflowAffiliateOffersService, Logger, Api],
	exports: [EverflowAffiliateOffersService],
})
export class EverflowAffiliateOffersModule {}
