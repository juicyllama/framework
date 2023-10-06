import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import shopifyConfig from '../config/shopify.config'
import { shopifyConfigJoi } from '../config/shopify.config.joi'
import { ShopifyAuthModule } from './auth/auth.module'
import { ShopifyInstallationService } from './shopify.installation'
import { AppsModule } from '@juicyllama/app-store'
import { databaseConfig } from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShopifyOrdersModule } from './orders/orders.module'
import { ShopifyWebhooksModule } from './webhooks/webhooks.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [shopifyConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(shopifyConfigJoi) : null,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
		forwardRef(() => AppsModule),
		forwardRef(() => ShopifyAuthModule),
		forwardRef(() => ShopifyOrdersModule),
		forwardRef(() => ShopifyWebhooksModule),
	],
	providers: [ShopifyInstallationService, Logger],
})
export class ShopifyModule {}
