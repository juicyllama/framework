import { PaymentMethod } from './payment.methods.entity'

export const BILLING_PAYMENT_MENTHODS_NAME = 'payment method'
export const BILLING_PAYMENT_MENTHODS_PRIMARY_KEY = 'payment_method_id'
export const BILLING_PAYMENT_MENTHODS_SEARCH_FIELDS = [
	'method',
	'currency',
	'can_send',
	'can_charge',
	'can_refund',
	'app_integration_name',
	'status',
]
export const BILLING_PAYMENT_MENTHODS_DEFAULT_ORDER_BY = 'payment_method_id'

export const BILLING_PAYMENT_MENTHODS_E = PaymentMethod
export type BILLING_PAYMENT_MENTHODS_T = PaymentMethod