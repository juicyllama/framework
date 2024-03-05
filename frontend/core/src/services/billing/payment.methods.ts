import { Api } from '../../helpers'
import { PaymentMethod } from '../../types'

type T = PaymentMethod
export const PAYMENT_METHODS_ENDPOINT = '/billing/payment/methods'
export const PAYMENT_METHODS_PUSHER_EVENT = 'account_${account_id}_billing_payment_methods'

export class BillingPaymentMethodsService extends Api<T> {
	constructor() {
		super(PAYMENT_METHODS_ENDPOINT)
	}
}

export const billingPaymentMethodsService = new BillingPaymentMethodsService()
