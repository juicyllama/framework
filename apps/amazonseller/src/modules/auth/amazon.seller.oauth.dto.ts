import { IsString } from 'class-validator'

export class AmazonSellerOauthRedirectDto {
	@IsString()
	amazon_callback_uri!: string

	@IsString()
	amazon_state!: string

	@IsString()
	version!: string

	@IsString()
	selling_partner_id!: string
}
