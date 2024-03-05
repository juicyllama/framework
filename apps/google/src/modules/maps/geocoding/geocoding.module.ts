import { ConfigValidationModule, MONGODB, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GoogleConfigDto } from '../../../config/google.config.dto'
import { GoogleMapsGeocoding } from './geocoding.entity.mongo'
import { GeocodingService } from './geocoding.service'
import { GoogleMapsClientProviderModule } from '../provider/provider.module'

@Module({
	imports: [
		ConfigValidationModule.register(GoogleConfigDto),
		TypeOrmModule.forFeature([GoogleMapsGeocoding], MONGODB),
		GoogleMapsClientProviderModule,
	],
	controllers: [],
	providers: [GeocodingService, Logger, Query],
	exports: [GeocodingService],
})
export class GeocodingModule {}
