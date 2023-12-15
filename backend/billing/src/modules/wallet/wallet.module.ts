import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Wallet } from './wallet.entity'
import { WalletController } from './wallet.controller'
import { WalletService } from './wallet.service'
import { AccountModule, AuthModule, Query, SettingsModule } from '@juicyllama/core'
import { Payment } from '../payments/payments.entity'
import { Charge } from '../charges/charges.entity'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { Invoice } from '../invoices/invoices.entity'
import { ChargesModule } from '../charges/charges.module'
import { WalletCronsController } from './wallet.crons.controller'
import { WalletCronService } from './wallet.crons.service'
import { PaymentMethodsModule } from '../payment_methods/payment.methods.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([Charge, Payment, PaymentMethod, Invoice, Wallet]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => ChargesModule),
		forwardRef(() => PaymentMethodsModule),
		forwardRef(() => SettingsModule),
	],
	controllers: [WalletController, WalletCronsController],
	providers: [WalletService, WalletCronService, Logger, Query],
	exports: [WalletService],
})
export class WalletModule {}
