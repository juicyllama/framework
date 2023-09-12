import { GoogleMapsGeocoding } from './geocoding.entity.mongo'
import { GeocodeResult } from '@googlemaps/google-maps-services-js/src/common'

export function googleGeocodeToEntity(search: string, apiResult: GeocodeResult): GoogleMapsGeocoding {
	return {
		search: search,
		...apiResult,
	}
}
