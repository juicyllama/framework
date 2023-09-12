import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { MONGODB, mongodbConfig, Query } from '@juicyllama/core'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { NumberVerificationService } from './number.verification.service'
import apilayerConfig from '../../config/apilayer.config'
import { apilayerConfigJoi } from '../../config/apilayer.config.joi'
import { NumberVerification } from './number.verification.entity.mongo'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [mongodbConfig, apilayerConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(apilayerConfigJoi) : null,
		}),
		TypeOrmModule.forRootAsync(mongodbConfig()),
		TypeOrmModule.forFeature([NumberVerification], MONGODB),
	],
	controllers: [],
	providers: [NumberVerificationService, Logger, Query, Api],
	exports: [NumberVerificationService],
})
export class NumberVerificationModule {}
