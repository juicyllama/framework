import { SupportedCurrencies } from '@juicyllama/utils'
import { Account } from '../account'
import { AppStoreIntegrationName } from '../appstore'

export enum PaymentMethodStatus {
	pending = 'pending',
	active = 'active',
	disabled = 'disabled',
}

export enum PaymentMethodType {
	creditcard = 'creditcard',
	banktransfer = 'banktransfer',
}

export enum PaymentMethodRelations {
	account = 'account',
}

export interface PaymentMethod {
	payment_method_id: number
	account: Account
	account_id: number
	method: PaymentMethodType
	details?: unknown
	currency: SupportedCurrencies
	can_send?: boolean
	can_charge?: boolean
	can_refund?: boolean
	app_integration_name?: AppStoreIntegrationName
	app_payment_method_id?: number
	next_attempt_at?: Date
	attempts?: number
	status?: PaymentMethodStatus
	redirect_url?: string
	client_redirect_url?: string
	created_at?: Date
	updated_at?: Date
}
