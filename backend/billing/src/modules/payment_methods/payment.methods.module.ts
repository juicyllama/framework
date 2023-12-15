import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { AccountModule, AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { PaymentMethodsService } from './payment.methods.service'
import { PaymentMethodsController } from './payment.methods.controller'
import { PaymentMethod } from './payment.methods.entity'
import { Charge } from '../charges/charges.entity'
import { Invoice } from '../invoices/invoices.entity'
import { Payment } from '../payments/payments.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([PaymentMethod, Charge, Invoice, Payment]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
	],
	controllers: [PaymentMethodsController],
	providers: [PaymentMethodsService, Logger, Query],
	exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
