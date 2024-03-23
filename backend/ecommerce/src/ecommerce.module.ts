import { Module, forwardRef } from '@nestjs/common'
import { BundlesModule } from './modules/product/bundles/bundles.module'
import { SkusModule } from './modules/product/skus/skus.module'
import { StockModule } from './modules/stock/stock.module'
import { StockLocationsModule } from './modules/stock/locations/locations.module'
import { StoresModule } from './modules/stores/stores.module'
import { TransactionsModule } from './modules/transactions/transactions.module'
import { TransactionDiscountsModule } from './modules/transactions/discounts/discounts.module'
import { TransactionItemsModule } from './modules/transactions/items/items.module'

@Module({
	imports: [
		forwardRef(() => BundlesModule),
		forwardRef(() => SkusModule),
		forwardRef(() => StockModule),
		forwardRef(() => StockLocationsModule),
		forwardRef(() => StoresModule), 
		forwardRef(() => TransactionsModule), 
		forwardRef(() => TransactionDiscountsModule),
		forwardRef(() => TransactionItemsModule)
	],
})
export class EcommerceModule {}
