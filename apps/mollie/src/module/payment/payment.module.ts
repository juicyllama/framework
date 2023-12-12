import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MolliePayment } from './payment.entity'
import { PaymentService } from './payment.service'
import { CustomerModule } from '../customer/customer.module'
import { MandateModule } from '../mandate/mandate.module'
import { ConfigModule } from '@nestjs/config'
import mollieConfig from '../../config/mollie.config'
import { Enviroment, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { moillieConfigJoi } from '../../config/mollie.config.joi'
import { PaymentController } from './payment.controller'
import { AccountModule, Query } from '@juicyllama/core'
import { PaymentsModule } from '@juicyllama/billing'

@Module({
	imports: [
		TypeOrmModule.forFeature([MolliePayment]),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [mollieConfig],
			validationSchema: process.env.NODE_ENV !== Enviroment.test ? Joi.object(moillieConfigJoi) : null,
		}),
		forwardRef(() => AccountModule),
		forwardRef(() => CustomerModule),
		forwardRef(() => MandateModule),
		forwardRef(() => PaymentsModule),
	],
	controllers: [PaymentController],
	providers: [PaymentService, Logger, Query],
	exports: [PaymentService],
})
export class PaymentModule {}
