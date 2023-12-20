import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { mongodbConfig } from '@juicyllama/core'
import { PlacesModule } from './places/places.module'
import { GeocodingModule } from './geocoding/geocoding.module'

@Module({
	imports: [TypeOrmModule.forRootAsync(mongodbConfig()), GeocodingModule, PlacesModule],
})
export class GoogleMapsModule {}
