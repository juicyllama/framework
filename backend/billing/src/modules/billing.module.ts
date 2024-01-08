import { forwardRef, Module } from '@nestjs/common'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { ConfigModule } from '@nestjs/config'
import { Logger } from '@juicyllama/utils'
import billingConfig from '../config/billing.config'
import { AccountModule, AuthModule, Query, TagsModule } from '@juicyllama/core'
import { ChargesModule } from './charges/charges.module'
import { WalletModule } from './wallet/wallet.module'
import { InvoicesModule } from './invoices/invoices.module'
import { PaymentsModule } from './payments/payments.module'
import { PaymentMethodsModule } from './payment_methods/payment.methods.module'
import { WithdrawalsModule } from './withdrawals/withdrawals.module'
import { TaxModule } from './tax/tax.module'

@Module({
	imports: [
		ConfigModule.forFeature(billingConfig),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => ChargesModule),
		forwardRef(() => InvoicesModule),
		forwardRef(() => PaymentsModule),
		forwardRef(() => PaymentMethodsModule),
		forwardRef(() => SubscriptionsModule),
		forwardRef(() => TagsModule),
		forwardRef(() => TaxModule),
		forwardRef(() => WalletModule),
		forwardRef(() => WithdrawalsModule),
	],
	providers: [Logger, Query],
})
export class BillingModule {}
