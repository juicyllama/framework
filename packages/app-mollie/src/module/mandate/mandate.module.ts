import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MollieMandate } from './mandate.entity'
import { MandateService } from './mandate.service'
import { CustomerModule } from '../customer/customer.module'
import { ConfigModule } from '@nestjs/config'
import mollieConfig from '../../config/mollie.config'
import { Enviroment, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { moillieConfigJoi } from '../../config/mollie.config.joi'
import { Query } from '@juicyllama/core'

@Module({
	imports: [
		TypeOrmModule.forFeature([MollieMandate]),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [mollieConfig],
			validationSchema: process.env.NODE_ENV !== Enviroment.test ? Joi.object(moillieConfigJoi) : null,
		}),
		forwardRef(() => CustomerModule),
	],
	controllers: [],
	providers: [MandateService, Logger, Query],
	exports: [MandateService],
})
export class MandateModule {}
