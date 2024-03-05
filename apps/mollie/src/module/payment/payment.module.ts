import { PaymentsModule } from '@juicyllama/billing'
import { AccountModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerModule } from '../customer/customer.module'
import { MandateModule } from '../mandate/mandate.module'
import { MollieProviderModule } from '../provider'
import { PaymentController } from './payment.controller'
import { MolliePayment } from './payment.entity'
import { PaymentService } from './payment.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([MolliePayment]),
		MollieProviderModule,
		AccountModule,
		CustomerModule,
		MandateModule,
		PaymentsModule,
	],
	controllers: [PaymentController],
	providers: [PaymentService, Logger, Query],
	exports: [PaymentService],
})
export class PaymentModule {}
