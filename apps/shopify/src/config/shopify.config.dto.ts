import { IsString, IsUrl } from 'class-validator'

export class shopifyConfigDto {
	@IsUrl()
	SHOPIFY_APP_CLIENT_ID: string

	@IsString()
	SHOPIFY_APP_CLIENT_SECRET: string

	@IsString()
	SHOPIFY_EXTRA_SCOPES: string
}
