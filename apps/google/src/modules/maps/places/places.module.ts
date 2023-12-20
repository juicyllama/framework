import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigValidationModule, MONGODB, Query } from '@juicyllama/core'
import { Api, Logger } from '@juicyllama/utils'
import { GoogleConfigDto } from '../../../config/google.config.dto'
import { GoogleMapsClientProviderModule } from '../provider'
import { GoogleMapsPlace } from './places.entity.mongo'
import { PlacesService } from './places.service'

@Module({
	imports: [
		ConfigValidationModule.register(GoogleConfigDto),
		TypeOrmModule.forFeature([GoogleMapsPlace], MONGODB),
		GoogleMapsClientProviderModule,
	],
	controllers: [],
	providers: [PlacesService, Logger, Query, Api],
	exports: [PlacesService],
})
export class PlacesModule {}
