import { IsString } from 'class-validator'

export class AmazonSellerAppCredentialsDto {
	@IsString()
	MARKETPLACE_ID!: string

	@IsString()
	PARTNER_ID!: string
}

export class AmazonSellerAppDto {
	@IsString()
	APP_ID!: string

	@IsString()
	CLIENT_ID!: string

	@IsString()
	CLIENT_SECRET!: string

	@IsString()
	AMAZON_MARKETPLACE_ACCESS_KEY!: string

	@IsString()
	AMAZON_MARKETPLACE_SECRET!: string
}
