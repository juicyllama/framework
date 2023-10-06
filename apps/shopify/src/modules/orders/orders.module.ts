import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import shopifyConfig from '../../config/shopify.config'
import { shopifyConfigJoi } from '../../config/shopify.config.joi'
import { InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { ShopifyOrdersService } from './orders.service'
import { ShopifyOrdersController } from './orders.controller'
import { ShopifyOrdersCronController } from './orders.cron.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { ShopifyOrdersCronService } from './orders.cron.service'
import { StoresModule, TransactionDiscountsModule, TransactionsModule } from '@juicyllama/ecommerce'
import { ShopifyOrdersMapperService } from './orders.mapper.service'
import { ContactsModule } from '@juicyllama/crm'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [shopifyConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(shopifyConfigJoi) : null,
		}),
		ScheduleModule.forRoot(),
		forwardRef(() => ContactsModule),
		forwardRef(() => OAuthModule),
		forwardRef(() => InstalledAppsModule),
		forwardRef(() => StoresModule),
		forwardRef(() => TransactionsModule),
		forwardRef(() => TransactionDiscountsModule),
	],
	controllers: [ShopifyOrdersController, ShopifyOrdersCronController],
	providers: [ShopifyOrdersService, ShopifyOrdersCronService, ShopifyOrdersMapperService, Logger],
	exports: [ShopifyOrdersService],
})
export class ShopifyOrdersModule {}
