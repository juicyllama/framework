import { AuthModule, BeaconModule, cacheConfig, databaseConfig, FxModule, jwtConfig, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoresModule } from '../stores/stores.module'
import { TransactionDiscountsModule } from './discounts/discounts.module'
import { TransactionsController } from './transactions.controller'
import { Transaction } from './transactions.entity'
import { TransactionsService } from './transactions.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Transaction]),
		JwtModule.register(jwtConfig()),
		AuthModule,
		BeaconModule,
		StoresModule,
		TransactionDiscountsModule,
		FxModule,
	],
	controllers: [TransactionsController],
	providers: [TransactionsService, Logger, Query],
	exports: [TransactionsService],
})
export class TransactionsModule {}
