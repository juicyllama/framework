import { AccountModule, AuthModule, BeaconModule, jwtConfig, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionDiscountsController } from './discounts.controller'
import { TransactionDiscount } from './discounts.entity'
import { TransactionDiscountsService } from './discounts.service'

@Module({
	imports: [
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
