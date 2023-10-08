import { forwardRef, Module } from '@nestjs/common'
import { StoresModule } from './stores/stores.module'
import { TransactionsModule } from './transactions/transactions.module'
import { TransactionDiscountsModule } from './transactions/discounts/discounts.module'
@Module({
	imports: [
		forwardRef(() => StoresModule),
		forwardRef(() => TransactionsModule),
		forwardRef(() => TransactionDiscountsModule)
	],
})
export class EcommerceModule {}
