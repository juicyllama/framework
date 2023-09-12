import { Entity, ObjectId, ObjectIdColumn, Column, Unique } from 'typeorm'
import { IsString, IsBoolean } from 'class-validator'
import { BaseEntity } from '@juicyllama/core'
import {
	AddressComponent,
	AddressGeometry,
	AddressType,
	PlusCode,
} from '@googlemaps/google-maps-services-js/src/common'

@Entity()
@Unique('google_maps_geocoding_UNIQUE', ['search'])
export class GoogleMapsGeocoding extends BaseEntity {
	@ObjectIdColumn()
	id?: ObjectId

	@Column()
	@IsString()
	search: string //this is the string that was used to search for the geocoding

	@Column({ type: 'json' })
	address_components: AddressComponent[]

	@Column()
	@IsString()
	formatted_address: string

	@Column({ type: 'json' })
	geometry: AddressGeometry

	@Column()
	@IsString()
	place_id: string

	@Column({ type: 'json' })
	plus_code: PlusCode

	@Column({ type: 'json' })
	types: AddressType[]

	@Column()
	@IsBoolean()
	partial_match: boolean
}
