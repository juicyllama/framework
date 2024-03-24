import { InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { ContactsModule } from '@juicyllama/crm'
import {
	StoresModule,
	TransactionDiscountsModule,
	TransactionsModule,
	TransactionItemsModule,
	SkusModule,
	BundlesModule,
} from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { ShopifyProviderModule } from '../provider/provider.module'
import { ShopifyOrdersService } from './orders.service'

@Module({
	imports: [
		forwardRef(() => BundlesModule),
		forwardRef(() => ContactsModule),
		forwardRef(() => OAuthModule),
		forwardRef(() => InstalledAppsModule),
		forwardRef(() => StoresModule),
		forwardRef(() => TransactionsModule),
		forwardRef(() => TransactionDiscountsModule),
		forwardRef(() => TransactionItemsModule),
		forwardRef(() => SkusModule),
		forwardRef(() => ShopifyProviderModule),
	],
	controllers: [],
	providers: [ShopifyOrdersService, Logger],
	exports: [ShopifyOrdersService],
})
export class ShopifyOrdersModule {}
