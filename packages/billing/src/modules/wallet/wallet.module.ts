import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { Logger } from '@juicyllama/utils'
import { Wallet } from './wallet.entity'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'
import { AccountModule, AuthModule, databaseConfig, jwtConfig, Query } from '@juicyllama/core'
import { Payment } from '../payments/payments.entity'
import { Charge } from '../charges/charges.entity'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { Invoice } from '../invoices/invoices.entity'
import { ChargesModule } from '../charges/charges.module'

@Module({
	imports: [
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Charge, Payment, PaymentMethod, Invoice, Wallet]),
		JwtModule.register(jwtConfig()),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => ChargesModule),
	],
	controllers: [WalletController],
	providers: [WalletService, Logger, Query],
	exports: [WalletService],
})
export class WalletModule {}
