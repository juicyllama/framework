import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Invoice } from './invoices.entity'
import { InvoicesService } from './invoices.service'
import { InvoicesController } from './invoices.controller'
import { JwtModule } from '@nestjs/jwt'
import { Account, AccountModule, AuthModule, StorageModule, databaseConfig, jwtConfig, Query } from '@juicyllama/core'
import { Charge } from '../charges/charges.entity'
import { Payment } from '../payments/payments.entity'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Account, Charge, Invoice, Payment, PaymentMethod]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => StorageModule),
		forwardRef(() => InvoicesModule),
	],
	controllers: [InvoicesController],
	providers: [InvoicesService, Logger, Query],
	exports: [InvoicesService],
})
export class InvoicesModule {}
