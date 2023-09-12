import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env } from '@juicyllama/utils'
import Joi from 'joi'
import everflowConfig from '../config/everflow.config'
import { everflowConfigJoi } from '../config/everflow.config.joi'
import { EverflowAffiliateReportingConversionsModule } from './affiliate/reporting/conversions/everflow.affiliate.reporting.conversions.module'
import { EverflowAffiliateReportingClicksModule } from './affiliate/reporting/clicks/everflow.affiliate.reporting.clicks.module'
import { EverflowAffiliateOffersModule } from './affiliate/offers/everflow.affiliate.offers.module'
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [everflowConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(everflowConfigJoi) : null,
		}),
		forwardRef(() => EverflowAffiliateReportingClicksModule),
		forwardRef(() => EverflowAffiliateReportingConversionsModule),
		forwardRef(() => EverflowAffiliateOffersModule),
	],
})
export class EverflowModule {}
