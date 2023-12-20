import { Module } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { EverflowAffiliateReportingConversionsService } from './everflow.affiliate.reporting.conversions.service'

@Module({
	controllers: [],
	providers: [EverflowAffiliateReportingConversionsService, Logger, Api],
	exports: [EverflowAffiliateReportingConversionsService],
})
export class EverflowAffiliateReportingConversionsModule {}
