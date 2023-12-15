import { InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { ContactsModule } from '@juicyllama/crm'
import { StoresModule, TransactionDiscountsModule, TransactionsModule } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ShopifyProviderModule } from '../provider/provider.module'
import { ShopifyOrdersController } from './orders.controller'
import { ShopifyOrdersCronController } from './orders.cron.controller'
import { ShopifyOrdersCronService } from './orders.cron.service'
import { ShopifyOrdersMapperService } from './orders.mapper.service'
import { ShopifyOrdersService } from './orders.service'

@Module({
	imports: [
		ContactsModule,
		OAuthModule,
		InstalledAppsModule,
		StoresModule,
		TransactionsModule,
		TransactionDiscountsModule,
		ShopifyProviderModule,
	],
	controllers: [ShopifyOrdersController, ShopifyOrdersCronController],
	providers: [ShopifyOrdersService, ShopifyOrdersCronService, ShopifyOrdersMapperService, Logger],
	exports: [ShopifyOrdersService],
})
export class ShopifyOrdersModule {}
