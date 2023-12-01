import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Shopify } from '../../config/shopify.config'
import { SHOPIFY_PROVIDER_TOKEN } from './provider.constants'

@Module({
	imports: [],
	providers: [
		{
			provide: SHOPIFY_PROVIDER_TOKEN,
			inject: [ConfigService],
			useFactory: (config: ConfigService) => Shopify(config.get('shopify')),
		},
	],
	exports: [SHOPIFY_PROVIDER_TOKEN],
})
export class ShopifyProviderModule {}
