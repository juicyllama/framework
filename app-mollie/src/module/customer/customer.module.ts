import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MollieCustomer } from './customer.entity'
import { CustomerService } from './customer.service'
import { ConfigModule } from '@nestjs/config'
import mollieConfig from '../../config/mollie.config'
import { Enviroment, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { moillieConfigJoi } from '../../config/mollie.config.joi'
import { Query } from '@juicyllama/core'

@Module({
	imports: [
		TypeOrmModule.forFeature([MollieCustomer]),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [mollieConfig],
			validationSchema: process.env.NODE_ENV !== Enviroment.test ? Joi.object(moillieConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [CustomerService, Logger, Query],
	exports: [CustomerService],
})
export class CustomerModule {}
