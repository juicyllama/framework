import { faker } from '@faker-js/faker'
import { DeepPartial } from 'typeorm'
import { Subscription } from '../modules/subscriptions/subscriptions.entity'
import { Account, AppIntegrationName, User } from '@juicyllama/core'
import { SubscriptionFrequency, SupportedCurrencies } from '@juicyllama/utils'
import { Charge } from '../modules/charges/charges.entity'
import { Payment } from '../modules/payments/payments.entity'
import { Invoice } from '../modules/invoices/invoices.entity'
import { PaymentMethod } from '../modules/payment_methods/payment.methods.entity'
import { PaymentMethodStatus, PaymentMethodType } from '../modules/payment_methods/payment.methods.enums'
import { Withdrawal } from '../modules/withdrawals/withdrawals.entity'

export function MockSubscriptionRequest(account: Account, added_by: User): DeepPartial<Subscription> {
	const total = Number(faker.commerce.price())
	return {
		account: account,
		name: faker.random.word(),
		description: faker.random.words(),
		amount_subtotal: total,
		amount_tax: 0,
		amount_total: total,
		currency: SupportedCurrencies.USD,
		frequency: SubscriptionFrequency.MONTHLY,
		added_by: added_by,
	}
}

export function MockChargeRequest(account: Account, added_by: User, min?: number): DeepPartial<Charge> {
	const total = Number(faker.commerce.price())
	return {
		account: account,
		currency: SupportedCurrencies.USD,
		name: faker.random.word(),
		description: faker.random.words(),
		amount_subtotal: total,
		amount_tax: 0,
		amount_total: total,
		added_by: added_by,
	}
}

export function MockPaymentRequest(account: Account, min?: number, max?: number): DeepPartial<Payment> {
	return {
		account: account,
		currency: SupportedCurrencies.USD,
		amount: Number(faker.commerce.price(min ?? 0, max ?? 1000)),
		payment_method: MockPaymentMethodCCRequest(account),
		app_payment_id: Number(faker.random.numeric(6)),
	}
}

export function MockInvoiceRequest(account: Account): DeepPartial<Invoice> {
	return {
		account: account,
		app_integration_name: AppIntegrationName.xero_cc,
		app_invoice_id: Number(faker.random.numeric(6)),
		amount_total: Number(faker.commerce.price()),
		currency: SupportedCurrencies.USD,
	}
}

export function MockPaymentMethodCCRequest(account: Account): DeepPartial<PaymentMethod> {
	return {
		account: account,
		method: PaymentMethodType.creditcard,
		details: {
			cardHolder: faker.name.firstName() + ' ' + faker.name.lastName(),
			cardNumber: faker.finance.creditCardNumber(),
			cardLabel: faker.finance.accountName(),
			cardFingerprint: faker.random.alphaNumeric(16),
			cardExpireDate: faker.date.future(),
		},
		can_send: false,
		can_charge: true,
		can_refund: true,
		app_integration_name: AppIntegrationName.mollie,
		app_payment_method_id: 1,
		next_attempt_at: faker.date.past(),
		status: PaymentMethodStatus.active,
		currency: SupportedCurrencies.USD,
	}
}

export function MockPaymentMethodBankRequest(account: Account): DeepPartial<PaymentMethod> {
	return {
		account: account,
		method: PaymentMethodType.banktransfer,
		details: {
			bank_name: 'Test Bank',
			account_details: {
				routing_number: faker.finance.routingNumber(),
				account_number: faker.finance.account(),
			},
		},
		can_send: true,
		can_charge: false,
		can_refund: true,
		app_integration_name: AppIntegrationName.wise,
		next_attempt_at: faker.date.past(),
		status: PaymentMethodStatus.active,
		currency: SupportedCurrencies.USD,
	}
}

export function MockWithdrawalRequest(account: Account, payment_method: PaymentMethod): DeepPartial<Withdrawal> {
	return {
		account: account,
		amount: Number(faker.commerce.price()),
		payment_method: payment_method,
		currency: SupportedCurrencies.USD,
	}
}
