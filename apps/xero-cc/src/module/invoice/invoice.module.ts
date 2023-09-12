import { forwardRef, Module } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { InvoiceService } from './invoice.service'
import { ContactModule } from '../customer/contact.module'
import { Query } from '@juicyllama/core'
import { AuthService } from '../xero.auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { XeroContact } from '../customer/contact.entity'
import { XeroInvoice } from './invoice.entity'

@Module({
	imports: [TypeOrmModule.forFeature([XeroContact, XeroInvoice]), forwardRef(() => ContactModule)],
	controllers: [],
	providers: [InvoiceService, Logger, Query, AuthService],
	exports: [InvoiceService],
})
export class InvoiceModule {}
