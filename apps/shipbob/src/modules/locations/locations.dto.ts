import { IsString, IsBoolean, IsNumber, IsObject, IsArray } from 'class-validator'
import { ShipbobAddress } from '../shipbob.common.dto'

export class ShipbobLocationServicesDto {
	@IsString()
	service_type!: string

	@IsBoolean()
	enabled!: boolean

	@IsObject()
	address!: ShipbobAddress
}

export class ShipbobLocationRegion {
	@IsNumber()
	id!: number

	@IsString()
	name!: string
}

export class ShipbobLocation {
	@IsNumber()
	id!: number

	@IsString()
	name!: string

	@IsString()
	abbreviation?: string

	@IsString()
	timezone?: string

	@IsBoolean()
	is_active?: boolean

	@IsBoolean()
	is_receiving_enabled?: boolean

	@IsBoolean()
	is_shipping_enabled?: boolean

	@IsBoolean()
	access_granted?: boolean

	@IsArray()
	attributes?: string[]

	@IsArray()
	services?: ShipbobLocationServicesDto[]

	@IsObject()
	region!: ShipbobLocationRegion
}

export class ShipbobLocationFindParams {
	@IsBoolean()
	IncludeInactive?: boolean

	@IsBoolean()
	ReceivingEnabled?: boolean

	@IsBoolean()
	AccessGranted?: boolean
}
