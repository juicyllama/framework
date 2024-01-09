import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Payment } from './payments.entity'
import { PaymentsService } from './payments.service'
import { AccountModule, BeaconModule, Query } from '@juicyllama/core'
import { PaymentMethodsModule } from '../payment_methods/payment.methods.module'
import { PaymentsSubscriber } from './payments.subscriber'
import { Invoice } from '../invoices/invoices.entity'
import { Wallet } from '../wallet/wallet.entity'
import { Charge } from '../charges/charges.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([Charge, Payment, Invoice, Wallet]),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => PaymentMethodsModule),
	],
	controllers: [],
	providers: [PaymentsService, PaymentsSubscriber, Logger, Query],
	exports: [PaymentsService],
})
export class PaymentsModule {}
