import {
	AddressComponent,
	AddressGeometry,
	AddressType,
	PlusCode,
	OpeningHours,
	PlacePhoto,
} from '@googlemaps/google-maps-services-js/src/common'
import { PlaceReview } from '@googlemaps/google-maps-services-js'
import { BaseEntity } from '@juicyllama/core'
import { IsString, IsBoolean, IsNumber } from 'class-validator'
import { Entity, ObjectId, ObjectIdColumn, Column, Unique } from 'typeorm'

@Entity()
@Unique('google_maps_place_UNIQUE', ['place_id'])
export class GoogleMapsPlace extends BaseEntity {
	@ObjectIdColumn()
	id?: ObjectId

	@Column({ type: 'json' })
	address_components!: AddressComponent[]

	@Column()
	@IsString()
	adr_address!: string

	@Column()
	@IsString()
	business_status!: string

	@Column()
	@IsString()
	formatted_address!: string

	@Column()
	@IsString()
	formatted_phone_number!: string

	@Column({ type: 'json' })
	geometry!: AddressGeometry

	@Column()
	@IsString()
	icon!: string

	@Column()
	@IsString()
	icon_background_color!: string

	@Column()
	@IsString()
	icon_mask_base_uri!: string

	@Column()
	@IsString()
	international_phone_number!: string

	@Column()
	@IsString()
	name!: string

	@Column({ type: 'json' })
	opening_hours!: OpeningHours

	@Column()
	@IsBoolean()
	permanently_closed!: boolean

	@Column({ type: 'json' })
	photos!: PlacePhoto[]

	@Column()
	@IsString()
	place_id!: string

	@Column({ type: 'json' })
	plus_code!: PlusCode

	@Column()
	@IsNumber()
	price_level!: number

	@Column()
	@IsNumber()
	rating!: number

	@Column({ type: 'json' })
	reviews!: PlaceReview[]

	@Column({ type: 'json' })
	types!: AddressType[]

	@Column()
	@IsString()
	url!: string

	@Column()
	@IsNumber()
	user_ratings_total!: number

	@Column()
	@IsNumber()
	utc_offset!: number

	@Column()
	@IsString()
	vicinity!: string

	@Column()
	@IsString()
	website!: string
}
