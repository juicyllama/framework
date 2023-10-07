import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import shopifyConfig from '../../config/shopify.config'
import { shopifyConfigJoi } from '../../config/shopify.config.joi'
import { InstalledAppsModule } from '@juicyllama/app-store'
import { ShopifyShopService } from './shop.service'
import { ShopifyShopController } from './shop.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { StoresModule } from '@juicyllama/ecommerce'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [shopifyConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(shopifyConfigJoi) : null,
		}),
		ScheduleModule.forRoot(),
		forwardRef(() => InstalledAppsModule),
		forwardRef(() => StoresModule),
	],
	controllers: [ShopifyShopController],
	providers: [ShopifyShopService, Logger],
	exports: [ShopifyShopService],
})
export class ShopifyShopModule {}
