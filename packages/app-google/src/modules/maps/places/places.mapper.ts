import { GoogleMapsPlace } from './places.entity.mongo'
import { PlaceData } from '@googlemaps/google-maps-services-js/src/common'

export function googlePlaceDetailsToEntity(apiResult: Partial<PlaceData>): GoogleMapsPlace {
	return <GoogleMapsPlace>apiResult
}
