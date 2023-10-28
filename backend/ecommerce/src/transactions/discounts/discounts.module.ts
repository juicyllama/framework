import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TransactionDiscountsService } from './discounts.service'
import { TransactionDiscountsController } from './discounts.controller'
import { ConfigModule } from '@nestjs/config'
import {
	AccountModule,
	AuthModule,
	BeaconModule,
	cacheConfig,
	databaseConfig,
	jwtConfig,
	Query,
} from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { TransactionDiscount } from './discounts.entity'
import { TransactionsModule } from '../transactions.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([TransactionDiscount]),
		JwtModule.register(jwtConfig()),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => TransactionsModule),
	],
	controllers: [TransactionDiscountsController],
	providers: [TransactionDiscountsService, Logger, Query],
	exports: [TransactionDiscountsService],
})
export class TransactionDiscountsModule {}
