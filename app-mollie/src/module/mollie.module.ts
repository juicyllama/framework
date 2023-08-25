import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { moillieConfigJoi } from '../config/mollie.config.joi'
import mollieConfig from '../config/mollie.config'
import { Enviroment, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { CustomerModule } from './customer/customer.module'
import { MandateModule } from './mandate/mandate.module'
import { PaymentModule } from './payment/payment.module'
import { MollieService } from './mollie.service'
import { AccountModule, Query } from '@juicyllama/core'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [mollieConfig],
			validationSchema: process.env.NODE_ENV !== Enviroment.test ? Joi.object(moillieConfigJoi) : null,
		}),
		forwardRef(() => AccountModule),
		forwardRef(() => CustomerModule),
		forwardRef(() => MandateModule),
		forwardRef(() => PaymentModule),
	],
	controllers: [],
	providers: [MollieService, Logger, Query],
	exports: [MollieService],
})
export class MollieModule {}
