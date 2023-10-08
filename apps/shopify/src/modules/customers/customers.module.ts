import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import shopifyConfig from '../../config/shopify.config'
import { shopifyConfigJoi } from '../../config/shopify.config.joi'
import { InstalledAppsModule } from '@juicyllama/app-store'
import { ShopifyCustomersService } from './customers.service'
import { ShopifyCustomersController } from './customers.controller'
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
	controllers: [ShopifyCustomersController],
	providers: [ShopifyCustomersService, Logger],
	exports: [ShopifyCustomersService],
})
export class ShopifyCustomersModule {}
