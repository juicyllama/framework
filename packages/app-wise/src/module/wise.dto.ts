import { IsNumber, IsString } from 'class-validator'

export class WiseAddressDto {
	@IsString()
	addressFirstLine: string

	@IsString()
	city: string

	@IsString()
	postCode: string

	@IsString()
	stateCode: string

	@IsString()
	countryName: string

	@IsString()
	country: string
}

export class WiseAmountDto {
	@IsString()
	currency: string

	@IsNumber()
	value: number
}
