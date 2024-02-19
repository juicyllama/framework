import { ConfigValidationModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { XeroConfigDto } from '../../config/xero.config.dto'
import { AuthModule } from '../auth'
import { ContactModule } from '../customer/contact.module'
import { XeroInvoice } from './invoice.entity'
import { InvoiceService } from './invoice.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([XeroInvoice]),
		ContactModule,
		AuthModule,
		ConfigValidationModule.register(XeroConfigDto),
	],
	controllers: [],
	providers: [InvoiceService, Logger, Query],
	exports: [InvoiceService],
})
export class InvoiceModule {}
