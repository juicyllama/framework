import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { EverflowAffiliateReportingConversionsService } from './everflow.affiliate.reporting.conversions.service'
import everflowConfig from '../../../../config/everflow.config'
import { everflowConfigJoi } from '../../../../config/everflow.config.joi'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [everflowConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(everflowConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [EverflowAffiliateReportingConversionsService, Logger, Api],
	exports: [EverflowAffiliateReportingConversionsService],
})
export class EverflowAffiliateReportingConversionsModule {}
