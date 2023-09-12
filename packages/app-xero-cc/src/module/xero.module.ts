import { forwardRef, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { xeroConfigJoi } from '../config/xero.config.joi'
import xeroConfig from '../config/xero.config'
import { Env } from '@juicyllama/utils'
import Joi from 'joi'
import { ContactModule } from './customer/contact.module'
import { InvoiceModule } from './invoice/invoice.module'
import { XeroService } from './xero.service'
import { AccountModule, cacheConfig, databaseConfig, Query } from '@juicyllama/core'
import { XeroWebhookController } from './xero.webhook.controller'
import { Logger } from '@juicyllama/utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { XeroContact } from './customer/contact.entity'
import { XeroInvoice } from './invoice/invoice.entity'
import { AccountCodeModule } from './accountCode/account.code.module'
import { XeroAccountCode } from './accountCode/account.code.entity'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [databaseConfig, cacheConfig, xeroConfig],
			isGlobal: true,
			validationSchema: Env.IsNotTest() ? Joi.object(xeroConfigJoi) : null,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([XeroAccountCode, XeroContact, XeroInvoice]),
		CacheModule.registerAsync(cacheConfig()),
		forwardRef(() => AccountModule),
		forwardRef(() => AccountCodeModule),
		forwardRef(() => ContactModule),
		forwardRef(() => InvoiceModule),
	],
	controllers: [XeroWebhookController],
	providers: [XeroService, Logger, Query],
	exports: [XeroService],
})
export class XeroModule {}
