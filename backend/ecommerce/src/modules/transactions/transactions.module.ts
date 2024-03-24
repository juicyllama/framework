import { InstalledAppsModule } from '@juicyllama/app-store'
import { AuthModule, BeaconModule, FxModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoresModule } from '../stores/stores.module'
import { TransactionDiscountsModule } from './discounts/discounts.module'
import { TransactionsController } from './transactions.controller'
import { Transaction } from './transactions.entity'
import { TransactionsService } from './transactions.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Transaction]),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => StoresModule),
		forwardRef(() => TransactionDiscountsModule),
		forwardRef(() => FxModule),
		forwardRef(() => InstalledAppsModule),
	],
	controllers: [TransactionsController],
	providers: [TransactionsService, Logger, Query],
	exports: [TransactionsService],
})
export class TransactionsModule {}
