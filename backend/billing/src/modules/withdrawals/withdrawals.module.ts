import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { AccountModule, AuthModule, BeaconModule, Query, SettingsModule, UsersModule } from '@juicyllama/core'
import { WithdrawalsService } from './withdrawals.service'
import { Withdrawal } from './withdrawals.entity'
import { WalletModule } from '../wallet/wallet.module'
import { WithdrawalsController } from './withdrawals.controller'
import { PaymentMethodsModule } from '../payment_methods/payment.methods.module'
import { Invoice } from '../invoices/invoices.entity'
import { PaymentsModule } from '../payments/payments.module'
import { WithdrawalsCronsController } from './withdrawals.cron.controller'
import { WithdrawalsCronService } from './withdrawals.crons.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Withdrawal, Invoice]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => UsersModule),
		forwardRef(() => PaymentsModule),
		forwardRef(() => PaymentMethodsModule),
		forwardRef(() => SettingsModule),
		forwardRef(() => WalletModule),
	],
	controllers: [WithdrawalsController, WithdrawalsCronsController],
	providers: [WithdrawalsService, WithdrawalsCronService, Logger, Query],
	exports: [WithdrawalsService],
})
export class WithdrawalsModule {}
