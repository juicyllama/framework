import { PlaceData } from '@googlemaps/google-maps-services-js/src/common'
import { GoogleMapsPlace } from './places.entity.mongo'

export function googlePlaceDetailsToEntity(apiResult: Partial<PlaceData>): GoogleMapsPlace {
	return <GoogleMapsPlace>apiResult
}
