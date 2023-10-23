import { IsString, IsNumber, IsOptional } from 'class-validator'

export class ShopifyAuthRedirectQuery {
	@IsString()
	hmac: string

	@IsString()
	@IsOptional()
	code?: string

	@IsString()
	host: string

	@IsString()
	shop: string

	@IsString()
	@IsOptional()
	state?: string

	@IsString()
	timestamp: string

	@IsString()
	@IsOptional()
	redirect_url?: string //if you want to redirect to a specific url after authentication

	@IsNumber()
	@IsOptional()
	account_id?: number //if you want to assign "unknown" shopify stores to a specific account (defaults to 1)
}

export class ShopifyAuthCreateRequest {
	@IsNumber()
	installed_app_id: number //The installed_app_id for the shopify app you want to authenticate

	@IsString()
	shop: string // The name of the user's shop. e.g. https://{shop}.myshopify.com
}
