import { InstalledApp, Oauth } from '@juicyllama/app-store'
import { registerAs } from '@nestjs/config'
import '@shopify/shopify-api/adapters/node'
import { shopifyApi, LATEST_API_VERSION, Session } from '@shopify/shopify-api'
import { ShopifyConfigDto } from './shopify.config.dto'

export default registerAs(
	'shopify',
	() =>
		<any>{
			SHOPIFY_APP_CLIENT_ID: process.env.SHOPIFY_APP_CLIENT_ID,
			SHOPIFY_APP_CLIENT_SECRET: process.env.SHOPIFY_APP_CLIENT_SECRET,
			SHOPIFY_EXTRA_SCOPES: process.env.SHOPIFY_EXTRA_SCOPES,
			SHOPIFY_OAUTH_REDIRECT_URL: process.env.SHOPIFY_OAUTH_REDIRECT_URL,
		},
)

export const ShopifyAuthScopes = [
	...(process.env.SHOPIFY_EXTRA_SCOPES ? process.env.SHOPIFY_EXTRA_SCOPES.split(',') : []),
	'read_products',
	'read_inventory',
	'read_customers',
	'read_orders',
	'read_reports',
	'read_shipping',
	'read_returns',
]

export const ShopifyAuthRedirect = '/app/shopify/auth/redirect'

export function Shopify(config: ShopifyConfigDto) {
	return shopifyApi({
		apiKey: config.SHOPIFY_APP_CLIENT_ID,
		apiSecretKey: config.SHOPIFY_APP_CLIENT_SECRET,
		scopes: ShopifyAuthScopes,
		hostName: process.env.BASE_URL_API.replace(/https?:\/\//, ''),
		apiVersion: LATEST_API_VERSION,
		isEmbeddedApp: false,
	})
}

export function ShopifySession(installed_app: InstalledApp, oauth: Oauth) {
	return <Session>{
		shop: installed_app.settings.SHOPIFY_SHOP_NAME + '.myshopify.com',
		accessToken: oauth.access_token,
	}
}
