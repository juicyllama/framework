import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { NumberVerificationService } from './number.verification.service'
import apilayerConfig from '../../config/apilayer.config'
import { apilayerConfigJoi } from '../../config/apilayer.config.joi'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [apilayerConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(apilayerConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [NumberVerificationService, Logger, Api],
	exports: [NumberVerificationService],
})
export class NumberVerificationModule {}
