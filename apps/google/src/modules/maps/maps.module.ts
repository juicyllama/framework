import { Module } from '@nestjs/common'
import { PlacesModule } from './places/places.module'
import { GeocodingModule } from './geocoding/geocoding.module'

@Module({
	imports: [GeocodingModule, PlacesModule],
})
export class GoogleMapsModule {}
