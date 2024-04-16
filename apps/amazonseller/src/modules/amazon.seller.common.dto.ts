import { IsEnum, IsString, IsUrl } from 'class-validator'
import { AmazonSellerAddressType } from './amazon.seller.common.enums'

export class AmazonSellerMoneyDto {
	@IsString()
	CurrencyCode!: string

	@IsString()
	Amount!: string
}

export class AmazonSellerTaxCollectionDto {
	@IsString()
	Model?: string

	@IsString()
	ResponsibleParty?: string
}

export class AmazonSellerErrorListDto {
	@IsString()
	code!: string

	@IsString()
	message!: string

	@IsString()
	details?: string
}

export class AmazonSellerAddressDto {
	@IsString()
	Name!: string

	@IsString()
	AddressLine1?: string

	@IsString()
	AddressLine2?: string

	@IsString()
	AddressLine3?: string

	@IsString()
	City?: string

	@IsString()
	County?: string

	@IsString()
	District?: string

	@IsString()
	StateOrRegion?: string

	@IsString()
	Municipality?: string

	@IsString()
	PostalCode?: string

	@IsString()
	CountryCode?: string

	@IsString()
	Phone?: string

	@IsEnum(AmazonSellerAddressType)
	AddressType?: AmazonSellerAddressType
}

export class AmazonSellerTaxClassificationDto {
	@IsString()
	Name?: string

	@IsString()
	Value?: string
}

export class AmazonSellerMarketplaceDto {
	@IsString()
	name!: string

	@IsUrl()
	api_url!: string

	@IsString()
	api_endpoint!: string

	@IsUrl()
	url!: string

	@IsString()
	country!: string

	@IsString()
	marketplaceId!: string

	@IsString()
	countryCode!: string

	@IsString()
	AWSRegion!: string
}
