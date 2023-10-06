import { registerAs } from '@nestjs/config'
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION, Session } from '@shopify/shopify-api';
import { shopifyConfigDto } from './shopify.config.dto';
import { InstalledApp, Oauth } from '@juicyllama/app-store';

export default registerAs(
	'shopify',
	() =>
		<any>{
			SHOPIFY_APP_CLIENT_ID: process.env.SHOPIFY_APP_CLIENT_ID,
			SHOPIFY_APP_CLIENT_SECRET: process.env.SHOPIFY_APP_CLIENT_SECRET,
		},
)

export const ShopifyAuthScopes = [
	'read_products',
	'read_inventory',
	'read_customers',
	'read_orders',
	'read_reports',
	'read_shipping',
	'read_returns'
]

export const ShopifyAuthRedirect = '/app/shopify/auth/redirect'

export function Shopify(config: shopifyConfigDto) {
	return shopifyApi({
		apiKey: config.SHOPIFY_APP_CLIENT_ID,
		apiSecretKey: config.SHOPIFY_APP_CLIENT_SECRET,
		scopes: ShopifyAuthScopes,
		hostName: process.env.BASE_URL.replace(/https?:\/\//, ''),
		apiVersion: LATEST_API_VERSION,
		isEmbeddedApp: false
	})
}

export function ShopifySession(installed_app: InstalledApp, oauth: Oauth) {
	return <Session>{
		shop: installed_app.settings.SHOPIFY_SHOP_NAME +  '.myshopify.com',
		accessToken: oauth.access_token,
	}
}