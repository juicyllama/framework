import { GeocodeResult } from '@googlemaps/google-maps-services-js/src/common'
import { GoogleMapsGeocoding } from './geocoding.entity.mongo'

export function googleGeocodeToEntity(search: string, apiResult: GeocodeResult): GoogleMapsGeocoding {
	return {
		search: search,
		...apiResult,
	}
}
