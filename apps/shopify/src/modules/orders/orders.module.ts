import { Module, forwardRef } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { ShopifyOrdersService } from './orders.service'
import { ShopifyOrdersController } from './orders.controller'
import { ShopifyOrdersCronController } from './orders.cron.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { ShopifyOrdersCronService } from './orders.cron.service'
import { StoresModule, TransactionDiscountsModule, TransactionsModule } from '@juicyllama/ecommerce'
import { ShopifyOrdersMapperService } from './orders.mapper.service'
import { ContactsModule } from '@juicyllama/crm'
import { ShopifyProviderModule } from '../provider/provider.module'

@Module({
	imports: [
		ScheduleModule.forRoot(),
		forwardRef(() => ContactsModule),
		forwardRef(() => OAuthModule),
		forwardRef(() => InstalledAppsModule),
		forwardRef(() => StoresModule),
		forwardRef(() => TransactionsModule),
		forwardRef(() => TransactionDiscountsModule),
		ShopifyProviderModule,
	],
	controllers: [ShopifyOrdersController, ShopifyOrdersCronController],
	providers: [ShopifyOrdersService, ShopifyOrdersCronService, ShopifyOrdersMapperService, Logger],
	exports: [ShopifyOrdersService],
})
export class ShopifyOrdersModule {}
