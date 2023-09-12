import { Module } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { ContactService } from './contact.service'
import { Query } from '@juicyllama/core'
import { AuthService } from '../xero.auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { XeroContact } from './contact.entity'
import { XeroInvoice } from '../invoice/invoice.entity'

@Module({
	imports: [TypeOrmModule.forFeature([XeroContact, XeroInvoice])],
	controllers: [],
	providers: [ContactService, Logger, Query, AuthService],
	exports: [ContactService],
})
export class ContactModule {}
