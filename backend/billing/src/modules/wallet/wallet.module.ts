import { AccountModule, AuthModule, Query, SettingsModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChargesModule } from '../charges/charges.module'
import { PaymentMethodsModule } from '../payment_methods/payment.methods.module'
import { WalletController } from './wallet.controller'
import { WalletCronsController } from './wallet.crons.controller'
import { WalletCronService } from './wallet.crons.service'
import { Wallet } from './wallet.entity'
import { WalletService } from './wallet.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Wallet]),
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
