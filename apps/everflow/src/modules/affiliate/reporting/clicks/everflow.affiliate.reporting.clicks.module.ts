import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { EverflowAffiliateReportingClicksService } from './everflow.affiliate.reporting.clicks.service'

@Module({
	controllers: [],
	providers: [EverflowAffiliateReportingClicksService, Logger, Api],
	exports: [EverflowAffiliateReportingClicksService],
})
export class EverflowAffiliateReportingClicksModule {}
