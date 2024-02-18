import { AccountModule, BeaconModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Invoice } from '../..'
import { PaymentMethodsModule } from '../payment_methods/payment.methods.module'
import { Payment } from './payments.entity'
import { PaymentsService } from './payments.service'
import { PaymentsSubscriber } from './payments.subscriber'

@Module({
	imports: [TypeOrmModule.forFeature([Payment, Invoice]), AccountModule, BeaconModule, PaymentMethodsModule],
	controllers: [],
	providers: [PaymentsService, PaymentsSubscriber, Logger, Query],
	exports: [PaymentsService],
})
export class PaymentsModule {}
