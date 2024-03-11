import { InstalledAppsModule } from '@juicyllama/app-store'
import { AuthModule, BeaconModule, FxModule, jwtConfig, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoresModule } from '../stores/stores.module'
import { TransactionDiscountsModule } from './discounts/discounts.module'
import { TransactionsController } from './transactions.controller'
import { Transaction } from './transactions.entity'
import { TransactionsService } from './transactions.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Transaction]),
		JwtModule.register(jwtConfig()),
		AuthModule,
		BeaconModule,
		StoresModule,
		TransactionDiscountsModule,
		FxModule,
		InstalledAppsModule,
	],
	controllers: [TransactionsController],
	providers: [TransactionsService, Logger, Query],
	exports: [TransactionsService],
})
export class TransactionsModule {}
