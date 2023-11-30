import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Env } from '@juicyllama/utils'
import Joi from 'joi'
import shopifyConfig, { Shopify } from '../../config/shopify.config'
import { shopifyConfigJoi } from '../../config/shopify.config.joi'
import { SHOPIFY_PROVIDER_TOKEN } from './provider.constants'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [shopifyConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(shopifyConfigJoi) : null,
		}),
	],
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
