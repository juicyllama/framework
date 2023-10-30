import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { MONGODB, Query } from '@juicyllama/core'
import { Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { DataCacheService } from './data.cache.service'
import { dataCacheConfigJoi } from '../config/data.cache.config.joi'
import dataCacheConfig from '../config/data.cache.config'
import { NumberVerification } from '../entities/number.verification.entity.mongo'
import { Fx } from '../entities/fx.entity.mongo'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [dataCacheConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(dataCacheConfigJoi) : null,
		}),
		TypeOrmModule.forRootAsync(dataCacheConfig()),
		TypeOrmModule.forFeature([NumberVerification, Fx], MONGODB),
	],
	controllers: [],
	providers: [DataCacheService, Fx, NumberVerification, Logger, Query],
	exports: [DataCacheService, Fx, NumberVerification],
})
export class DataCacheModule {}
