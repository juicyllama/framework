import { AccountModule, ConfigValidationModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { XeroConfigDto } from '../config/xero.config.dto'
import { AccountCodeModule } from './accountCode/account.code.module'
import { ContactModule } from './customer/contact.module'
import { InvoiceModule } from './invoice/invoice.module'
import { XeroService } from './xero.service'
import { XeroWebhookController } from './xero.webhook.controller'

@Module({
	imports: [
		AccountModule,
		AccountCodeModule,
		ContactModule,
		InvoiceModule,
		ConfigValidationModule.register(XeroConfigDto),
	],
	controllers: [XeroWebhookController],
	providers: [XeroService, Logger, Query],
	exports: [XeroService],
})
export class XeroModule {}
