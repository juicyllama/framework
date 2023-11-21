# Geocoding

The Geocoding module provides a wrapper around the Google Maps Geocoding API.

For more information about this checkout the official (Google Maps Geocoding API)[https://developers.google.com/maps/documentation/geocoding/overview].

## Installation

Import the module into your project:

```typescript
// app.module.ts
import { GeocodingModule } from '@juicyllama/app-google'

@Module({
    imports: [
        forwardRef(() => GeocodingModule),
    ],
})
```

## Usage

Inject the service into your application:

```typescript
// app.service.ts
import { GeocodingService } from '@juicyllama/app-google'

@Injectable()
export class AppService {
	constructor(@Inject(forwardRef(() => GeocodingService)) private readonly geocodingService: GeocodingService) {}
}
```

## Methods

The service makes available the following methods:

### Find By Address

Returns the first Geocoding data for a given search string.

::alert{type="info"}
Give a full address for best results.
::

```typescript
// app.service.ts

const address = 'London Heathrow Airport, London, GB'
const geocoding = await this.geocodingService.findByAddress(address)
console.log(geocoding)
```

```bash
{
	"address_components": [
		{
			"long_name": "Heathrow Airport",
			"short_name": "Heathrow Airport",
			"types": [
				"airport",
				"establishment",
				"point_of_interest"
			]
		},
		{
			"long_name": "Longford",
			"short_name": "Longford",
			"types": [
				"locality",
				"political"
			]
		},
		{
			"long_name": "Greater London",
			"short_name": "Greater London",
			"types": [
				"administrative_area_level_2",
				"political"
			]
		},
		{
			"long_name": "England",
			"short_name": "England",
			"types": [
				"administrative_area_level_1",
				"political"
			]
		},
		{
			"long_name": "United Kingdom",
			"short_name": "GB",
			"types": [
				"country",
				"political"
			]
		},
		{
			"long_name": "TW6",
			"short_name": "TW6",
			"types": [
				"postal_code"
			]
		}
	],
	"formatted_address": "Heathrow Airport (LHR), Longford TW6, UK",
	"geometry": {
		"location": {
			"lat": 51.4700223,
			"lng": -0.4542955
		},
		"location_type": "GEOMETRIC_CENTER",
		"viewport": {
			"south": 51.4579141,
			"west": -0.495271,
			"north": 51.48121399999999,
			"east": -0.4229406
		}
	},
	"partial_match": true,
	"place_id": "ChIJ6W3FzTRydkgRZ0H2Q1VT548",
	"plus_code": {
		"compound_code": "FGCW+27 Longford, UK",
		"global_code": "9C3XFGCW+27"
	},
	"types": [
		"airport",
		"establishment",
		"point_of_interest"
	]
}
```
