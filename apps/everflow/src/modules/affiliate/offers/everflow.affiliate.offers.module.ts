import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { EverflowAffiliateOffersService } from './everflow.affiliate.offers.service'
import { everflowConfigJoi } from '../../../config/everflow.config.joi'
import everflowConfig from '../../../config/everflow.config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [everflowConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(everflowConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [EverflowAffiliateOffersService, Logger, Api],
	exports: [EverflowAffiliateOffersService],
})
export class EverflowAffiliateOffersModule {}
