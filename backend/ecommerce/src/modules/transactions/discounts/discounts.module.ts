import {
	AccountModule,
	AuthModule,
	BeaconModule,
	cacheConfig,
	databaseConfig,
	jwtConfig,
	Query,
} from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionDiscountsController } from './discounts.controller'
import { TransactionDiscount } from './discounts.entity'
import { TransactionDiscountsService } from './discounts.service'

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
		AuthModule,
		AccountModule,
		BeaconModule,
	],
	controllers: [TransactionDiscountsController],
	providers: [TransactionDiscountsService, Logger, Query],
	exports: [TransactionDiscountsService],
})
export class TransactionDiscountsModule {}
