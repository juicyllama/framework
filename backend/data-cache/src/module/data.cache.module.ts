import { Query } from '@juicyllama/core'
import { Env, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import Joi from 'joi'
import { dataCacheConfigJoi } from '../config/data.cache.config.joi'
import dataCacheConfig from '../config/data.cache.config'
import { Fx } from '../entities/fx.entity.mongo'
import { NumberVerification } from '../entities/number.verification.entity.mongo'
import { DATA_CAHCE_NAME } from './data.cache.constants'
import { DataCacheService } from './data.cache.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [dataCacheConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(dataCacheConfigJoi) : null,
		}),
		TypeOrmModule.forRootAsync(dataCacheConfig()),
		TypeOrmModule.forFeature([NumberVerification, Fx], DATA_CAHCE_NAME),
	],
	controllers: [],
	providers: [DataCacheService, Fx, NumberVerification, Logger, Query],
	exports: [DataCacheService, Fx, NumberVerification],
})
export class DataCacheModule {}
