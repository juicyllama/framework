import { IsString, IsOptional } from 'class-validator'

export class ShopifyConfigDto {
	@IsString()
	SHOPIFY_APP_CLIENT_ID: string

	@IsString()
	SHOPIFY_APP_CLIENT_SECRET: string

	@IsString()
	@IsOptional()
	SHOPIFY_EXTRA_SCOPES?: string

	@IsString()
	@IsOptional()
	SHOPIFY_OAUTH_REDIRECT_URL?: string

	@IsString()
	@IsOptional()
	CRON_APP_SHOPIFY_SYNC_ORDERS?: string

	@IsString()
	@IsOptional()
	CRON_APP_SHOPIFY_SYNC_ORDERS_FREQUENCY?: string
}
