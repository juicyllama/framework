import { Module } from '@nestjs/common'
import { StoresModule } from './modules/stores/stores.module'
import { TransactionsModule } from './modules/transactions/transactions.module'
import { TransactionDiscountsModule } from './modules/transactions/discounts/discounts.module'
@Module({
	imports: [StoresModule, TransactionsModule, TransactionDiscountsModule],
})
export class EcommerceModule {}
