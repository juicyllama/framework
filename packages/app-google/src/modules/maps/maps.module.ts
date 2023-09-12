import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { mongodbConfig } from '@juicyllama/core'
import { Env } from '@juicyllama/utils'
import Joi from 'joi'
import { PlacesModule } from './places/places.module'
import { GeocodingModule } from './geocoding/geocoding.module'
import googleConfig from '../../config/google.config'
import { googleConfigJoi } from '../../config/google.config.joi'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [mongodbConfig, googleConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(googleConfigJoi) : null,
		}),
		TypeOrmModule.forRootAsync(mongodbConfig()),
		forwardRef(() => GeocodingModule),
		forwardRef(() => PlacesModule),
	],
})
export class GoogleMapsModule {}
