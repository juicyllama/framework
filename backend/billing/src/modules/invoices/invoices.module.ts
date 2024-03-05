import { AccountModule, AuthModule, FxModule, Query, SettingsModule, StorageModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { LazyModuleLoader } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChargesModule } from '../charges/charges.module'
import { PaymentsModule } from '../payments/payments.module'
import { InvoicesController } from './invoices.controller'
import { InvoicesCronsController } from './invoices.cron.controller'
import { InvoicesCronService } from './invoices.crons.service'
import { Invoice } from './invoices.entity'
import { InvoicesService } from './invoices.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Invoice]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => ChargesModule),
		forwardRef(() => FxModule),
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
