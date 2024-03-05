import { AccountModule, AuthModule, Query, TagsModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import billingConfig from '../config/billing.config'
import { ChargesModule } from './charges/charges.module'
import { InvoicesModule } from './invoices/invoices.module'
import { PaymentsModule } from './payments/payments.module'
import { PaymentMethodsModule } from './payment_methods/payment.methods.module'
import { SubscriptionsModule } from './subscriptions/subscriptions.module'
import { TaxModule } from './tax/tax.module'
import { WalletModule } from './wallet/wallet.module'
import { WithdrawalsModule } from './withdrawals/withdrawals.module'

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
