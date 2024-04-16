import { AmazonSellerAppDto } from './app.credentials.dto'

export function amazonSellerConfig() {
	return <AmazonSellerAppDto>{
		APP_ID: process.env.AMAZON_SELLER_APP_ID,
		CLIENT_ID: process.env.AMAZON_SELLER_CLIENT_ID,
		CLIENT_SECRET: process.env.AMAZON_SELLER_CLIENT_SECRET,
		AMAZON_MARKETPLACE_ACCESS_KEY: process.env.AMAZON_MARKETPLACE_ACCESS_KEY,
		AMAZON_MARKETPLACE_SECRET: process.env.AMAZON_MARKETPLACE_SECRET,
	}
}
