import { forwardRef, Module, CacheModule } from '@nestjs/common'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { ConfigModule } from '@nestjs/config'
import { Enviroment } from '@juicyllama/utils'
import Joi from 'joi'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import billingConfig from '../config/billing.config'
import { billingConfigJoi } from '../config/billing.config.joi'
import {
	AccountModule,
	AuthModule,
	cacheConfig,
	databaseConfig,
	Query,
	SettingsModule,
	TagsModule,
} from '@juicyllama/core'
import { BillingCronsController } from './crons/billing.crons.controller'
import { BillingCronService } from './crons/billing.crons.service'
import { ChargesModule } from './charges/charges.module'
import { WalletModule } from './wallet/wallet.module'
import { InvoicesModule } from './invoices/invoices.module'
import { PaymentsModule } from './payments/payments.module'
import { PaymentMethodsModule } from './payment_methods/payment.methods.module'
import { WithdrawalsModule } from './withdrawals/withdrawals.module'
import { TaxModule } from './tax/tax.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [databaseConfig, billingConfig, cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: process.env.NODE_ENV !== Enviroment.test ? Joi.object(billingConfigJoi) : null,
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => ChargesModule),
		forwardRef(() => InvoicesModule),
		forwardRef(() => PaymentsModule),
		forwardRef(() => PaymentMethodsModule),
		forwardRef(() => SettingsModule),
		forwardRef(() => SubscriptionsModule),
		forwardRef(() => TagsModule),
		forwardRef(() => TaxModule),
		forwardRef(() => WalletModule),
		forwardRef(() => WithdrawalsModule),
	],
	controllers: [BillingCronsController],
	providers: [BillingCronService, Logger, Query],
	exports: [BillingCronService],
})
export class BillingModule {}
