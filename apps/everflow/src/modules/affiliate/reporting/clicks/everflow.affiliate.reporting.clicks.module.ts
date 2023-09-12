import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { EverflowAffiliateReportingClicksService } from './everflow.affiliate.reporting.clicks.service'
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
	providers: [EverflowAffiliateReportingClicksService, Logger, Api],
	exports: [EverflowAffiliateReportingClicksService],
})
export class EverflowAffiliateReportingClicksModule {}
