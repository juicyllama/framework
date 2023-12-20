import { Client } from '@googlemaps/google-maps-services-js'
import { ConfigValidationModule, MONGODB, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GoogleConfigDto } from '../../../config/google.config.dto'
import { GoogleMapsGeocoding } from './geocoding.entity.mongo'
import { GeocodingService } from './geocoding.service'
import { GoogleMapsClientToken } from './geocoding.constants'

@Module({
	imports: [
		ConfigValidationModule.register(GoogleConfigDto),
		TypeOrmModule.forFeature([GoogleMapsGeocoding], MONGODB),
	],
	controllers: [],
	providers: [
		GeocodingService,
		Logger,
		Query,
		{
			provide: GoogleMapsClientToken,
			useValue: new Client(),
		},
	],
	exports: [GeocodingService],
})
export class GeocodingModule {}
