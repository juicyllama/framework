import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { Logger } from '@juicyllama/utils'
import {
	AccountModule,
	AuthModule,
	BeaconModule,
	databaseConfig,
	jwtConfig,
	Query,
	UsersModule,
} from '@juicyllama/core'
import { WithdrawalsService } from './withdrawals.service'
import { Withdrawal } from './withdrawals.entity'
import { WalletModule } from '../wallet/wallet.module'
import { WithdrawalsController } from './withdrawals.controller'
import { PaymentMethodsModule } from '../payment_methods/payment.methods.module'
import { Invoice } from '../invoices/invoices.entity'
import { PaymentsModule } from '../payments/payments.module'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Withdrawal, Invoice]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => UsersModule),
		forwardRef(() => PaymentsModule),
		forwardRef(() => PaymentMethodsModule),
		forwardRef(() => WalletModule),
	],
	controllers: [WithdrawalsController],
	providers: [WithdrawalsService, Logger, Query],
	exports: [WithdrawalsService],
})
export class WithdrawalsModule {}
