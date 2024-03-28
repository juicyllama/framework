import { InstalledAppsModule } from '@juicyllama/app-store'
import { AuthModule, BeaconModule, FxModule, Query } from '@juicyllama/core'
import { ContactsModule } from '@juicyllama/crm'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoresModule } from '../stores/stores.module'
import { TransactionDiscountsModule } from './discounts/discounts.module'
import { TransactionsController } from './transactions.controller'
import { Transaction } from './transactions.entity'
import { TransactionsService } from './transactions.service'
import { TransactionsCronController } from './crons/transactions.cron.controller'
import { TransactionsCronSyncService } from './crons/transactions.cron.service'
import { TransactionsShopifyMapperService } from './crons/mappers/shopify/transactions.service'
import { BundlesModule, SkusModule, TransactionItemsModule } from '../..'
import { LazyModuleLoader } from '@nestjs/core'

@Module({
	imports: [
		TypeOrmModule.forFeature([Transaction]),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => BundlesModule),
		forwardRef(() => ContactsModule),
		forwardRef(() => StoresModule),
		forwardRef(() => TransactionDiscountsModule),
		forwardRef(() => TransactionItemsModule),
		forwardRef(() => FxModule),
		forwardRef(() => InstalledAppsModule),
		forwardRef(() => SkusModule),
	],
	controllers: [TransactionsController, TransactionsCronController],
	providers: [TransactionsService, TransactionsCronSyncService, TransactionsShopifyMapperService, Logger, Query, LazyModuleLoader],
	exports: [TransactionsService, TransactionsShopifyMapperService],
})
export class TransactionsModule {}
