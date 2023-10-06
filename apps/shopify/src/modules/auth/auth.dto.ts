import { IsString, IsNumber } from 'class-validator'

export class ShopifyAuthRedirectQuery {
	@IsString()
	hmac: string

	@IsString()
	code: string

	@IsString()
	host: string

	@IsString()
	shop: string

	@IsString()
	state: string

	@IsString()
	timestamp: string
}

export class ShopifyAuthCreateRequest {

	@IsNumber()
	installed_app_id: number //The installed_app_id for the shopify app you want to authenticate

	@IsString()
	shop: string // The name of the user's shop. e.g. https://{shop}.myshopify.com
}