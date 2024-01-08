import { forwardRef, Module } from '@nestjs/common'
import { StoresModule } from './modules/stores/stores.module'
import { TransactionsModule } from './modules/transactions/transactions.module'
import { TransactionDiscountsModule } from './modules/transactions/discounts/discounts.module'
@Module({
	imports: [
		forwardRef(() => StoresModule),
		forwardRef(() => TransactionsModule),
		forwardRef(() => TransactionDiscountsModule),
	],
})
export class EcommerceModule {}
