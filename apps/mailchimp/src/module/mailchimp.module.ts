import { ConfigModule } from '@nestjs/config'
import { Api, Enviroment } from '@juicyllama/utils'
import { MailchimpService } from './mailchimp.service'
import Joi from 'joi'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import mailchimpConfig from '../configs/mailchimp.config'
import { mailchimpConfigJoi } from '../configs/mailchimp.config.joi'
import { MailchimpContact } from './mailchimp.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig, Query } from '@juicyllama/core'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [mailchimpConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: process.env.NODE_ENV !== Enviroment.test ? Joi.object(mailchimpConfigJoi) : null,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([MailchimpContact]),
	],
	controllers: [],
	providers: [MailchimpService, Logger, Api, Query],
	exports: [MailchimpService],
})
export class MailchimpModule {}
