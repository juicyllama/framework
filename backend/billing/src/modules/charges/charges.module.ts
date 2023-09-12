import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { Logger } from '@juicyllama/utils'
import { Charge } from './charges.entity'
import { ChargesController } from './charges.controller'
import { ChargesService } from './charges.service'
import { AccountModule, AuthModule, databaseConfig, jwtConfig, Query, UsersModule } from '@juicyllama/core'
import { ChargesSubscriber } from './charges.subscriber'
import { Invoice } from '../invoices/invoices.entity'
import { Wallet } from '../wallet/wallet.entity'
import { Payment } from '../payments/payments.entity'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Charge, Invoice, Payment, PaymentMethod, Wallet]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => UsersModule),
	],
	controllers: [ChargesController],
	providers: [ChargesService, ChargesSubscriber, Logger, Query],
	exports: [ChargesService],
})
export class ChargesModule {}
