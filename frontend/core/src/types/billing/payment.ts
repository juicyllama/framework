import { SupportedCurrencies } from '@juicyllama/vue-utils'
import { Account } from '../account'
import { Invoice } from './invoice'
import { PaymentMethod, PaymentMethodType } from './payment_method'

export enum PaymentType {
	payment = 'payment',
	refund = 'refund',
	dispute = 'dispute',
}

export enum PaymentStatus {
	success = 'success',
	declined = 'declined',
	pending = 'pending',
}

export interface Payment {
	readonly payment_id: number
	account: Account
	account_id: number
	amount: number
	currency: SupportedCurrencies
	payment_method?: PaymentMethod
	payment_method_id: number
	app_payment_id: number
	type?: PaymentType
	method?: PaymentMethodType
	amount_allocated?: number
	invoices?: Invoice[]
	created_at?: Date
	updated_at?: Date
}
