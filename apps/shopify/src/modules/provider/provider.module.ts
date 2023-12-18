import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Module } from '@nestjs/common'
import { Shopify } from '../../config/shopify.config'
import { SHOPIFY_PROVIDER_TOKEN } from './provider.constants'
import { ShopifyConfigDto } from '../../config/shopify.config.dto'

@Module({
	imports: [ConfigValidationModule.register(ShopifyConfigDto)],
	providers: [
		{
			provide: SHOPIFY_PROVIDER_TOKEN,
			inject: [getConfigToken(ShopifyConfigDto)],
			useFactory: (config: ShopifyConfigDto) => Shopify(config),
		},
	],
	exports: [SHOPIFY_PROVIDER_TOKEN],
})
export class ShopifyProviderModule {}
