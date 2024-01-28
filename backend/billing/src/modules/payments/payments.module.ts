import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Payment } from './payments.entity'
import { PaymentsService } from './payments.service'
import { AccountModule, BeaconModule, Query } from '@juicyllama/core'
import { PaymentMethodsModule } from '../payment_methods/payment.methods.module'
import { PaymentsSubscriber } from './payments.subscriber'

@Module({
	imports: [TypeOrmModule.forFeature([Payment]), AccountModule, BeaconModule, PaymentMethodsModule],
	controllers: [],
	providers: [PaymentsService, PaymentsSubscriber, Logger, Query],
	exports: [PaymentsService],
})
export class PaymentsModule {}
