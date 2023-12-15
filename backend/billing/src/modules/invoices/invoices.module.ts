import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Invoice } from './invoices.entity'
import { InvoicesService } from './invoices.service'
import { InvoicesController } from './invoices.controller'
import { Account, AccountModule, AuthModule, StorageModule, Query, SettingsModule } from '@juicyllama/core'
import { Charge } from '../charges/charges.entity'
import { Payment } from '../payments/payments.entity'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { LazyModuleLoader } from '@nestjs/core'
import { InvoicesCronService } from './invoices.crons.service'
import { InvoicesCronsController } from './invoices.cron.controller'
import { ChargesModule } from '../charges/charges.module'
import { PaymentsModule } from '../payments/payments.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([Account, Charge, Invoice, Payment, PaymentMethod]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => ChargesModule),
		forwardRef(() => StorageModule),
		forwardRef(() => InvoicesModule),
		forwardRef(() => PaymentsModule),
		forwardRef(() => SettingsModule),
	],
	controllers: [InvoicesController, InvoicesCronsController],
	providers: [InvoicesService, InvoicesCronService, Logger, Query, LazyModuleLoader],
	exports: [InvoicesService],
})
export class InvoicesModule {}
