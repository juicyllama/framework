import { Client } from '@googlemaps/google-maps-services-js'
import { Module } from '@nestjs/common'
import { GoogleMapsClientToken } from './provider.constants'

@Module({
	providers: [
		{
			provide: GoogleMapsClientToken,
			useValue: new Client(),
		},
	],
	exports: [GoogleMapsClientToken],
})
export class GoogleMapsClientProviderModule {}
