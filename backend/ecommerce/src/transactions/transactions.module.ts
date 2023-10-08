import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TransactionsService } from './transactions.service'
import { TransactionsController } from './transactions.controller'
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
import { ContactsModule } from '@juicyllama/crm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { Transaction } from './transactions.entity'
import { StoresModule } from '../stores/stores.module'
import { TransactionDiscountsModule } from './discounts/discounts.module'

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
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => ContactsModule),
		forwardRef(() => StoresModule),
		forwardRef(() => TransactionDiscountsModule),
	],
	controllers: [TransactionsController],
	providers: [
		TransactionsService,
		Logger,
		Query,
	],
	exports: [TransactionsService],
})
export class TransactionsModule {}
