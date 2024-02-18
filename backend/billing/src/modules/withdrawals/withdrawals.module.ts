import { AccountModule, AuthModule, BeaconModule, Query, SettingsModule, UsersModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentsModule } from '../..'
import { PaymentMethodsModule } from '../payment_methods/payment.methods.module'
import { WalletModule } from '../wallet/wallet.module'
import { WithdrawalsController } from './withdrawals.controller'
import { WithdrawalsCronsController } from './withdrawals.cron.controller'
import { WithdrawalsCronService } from './withdrawals.crons.service'
import { Withdrawal } from './withdrawals.entity'
import { WithdrawalsService } from './withdrawals.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Withdrawal]),
		AuthModule,
		AccountModule,
		BeaconModule,
		UsersModule,
		PaymentMethodsModule,
		PaymentsModule,
		SettingsModule,
		forwardRef(() => WalletModule),

	],
	controllers: [WithdrawalsController, WithdrawalsCronsController],
	providers: [WithdrawalsService, WithdrawalsCronService, Logger, Query],
	exports: [WithdrawalsService],
})
export class WithdrawalsModule {}
