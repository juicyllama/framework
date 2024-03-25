import { IsString, IsNumber } from 'class-validator'

export class ShipbobAddress {
	@IsString()
	name!: string

	@IsString()
	address1!: string

	@IsString()
	address2?: string

	@IsString()
	city?: string

	@IsString()
	state?: string

	@IsString()
	country!: string

	@IsString()
	zip_code?: string

	@IsString()
	phone_number?: string

	@IsString()
	email?: string
}

export class ShipbobFindParams {
	@IsString()
	ReferenceIds?: string //Comma separated list of reference ids to filter by

	@IsNumber()
	Page?: number //Page of products to get - Valid Range is 0 to integer max with a default of 1

	@IsNumber() // Amount of products per page to request - Valid Range is 1 to 250 with a default of 50
	Limit?: number

	@IsString()
	IDs?: string //Comma separated list of product ids to filter by

	@IsString()
	Search?: string //see API docs for search fields for the endpoint in question
}

export class ShipbobChannel {
	@IsNumber()
	id!: number

	@IsString()
	name!: string
}
