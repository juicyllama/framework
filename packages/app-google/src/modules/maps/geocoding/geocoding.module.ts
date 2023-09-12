import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { MONGODB, mongodbConfig, Query } from '@juicyllama/core'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { GeocodingService } from './geocoding.service'
import googleConfig from '../../../config/google.config'
import { googleConfigJoi } from '../../../config/google.config.joi'
import { GoogleMapsGeocoding } from './geocoding.entity.mongo'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [mongodbConfig, googleConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(googleConfigJoi) : null,
		}),
		TypeOrmModule.forRootAsync(mongodbConfig()),
		TypeOrmModule.forFeature([GoogleMapsGeocoding], MONGODB),
	],
	controllers: [],
	providers: [GeocodingService, Logger, Query, Api],
	exports: [GeocodingService],
})
export class GeocodingModule {}
