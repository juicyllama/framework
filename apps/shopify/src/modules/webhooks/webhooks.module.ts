import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import shopifyConfig from '../../config/shopify.config'
import { shopifyConfigJoi } from '../../config/shopify.config.joi'
import { InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { ShopifyWebhooksService } from './webhooks.service'
import { ShopifyWebhooksController } from './webhooks.controller'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [shopifyConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(shopifyConfigJoi) : null,
		}),
		forwardRef(() => OAuthModule),
		forwardRef(() => InstalledAppsModule),
	],
	controllers: [ShopifyWebhooksController],
	providers: [ShopifyWebhooksService, Logger],
	exports: [ShopifyWebhooksService],
})
export class ShopifyWebhooksModule {}
