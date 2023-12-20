import { ConfigValidationModule } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { EverflowConfigDto } from '../../../../config/everflow.config.dto'
import { EverflowAffiliateReportingClicksService } from './everflow.affiliate.reporting.clicks.service'

@Module({
	imports: [ConfigValidationModule.register(EverflowConfigDto)],
	controllers: [],
	providers: [EverflowAffiliateReportingClicksService, Logger, Api],
	exports: [EverflowAffiliateReportingClicksService],
})
export class EverflowAffiliateReportingClicksModule {}
