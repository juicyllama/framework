import { Api } from '../../helpers'
import { Subscription } from '../../types'

type T = Subscription
export const BILLING_SUBSCRIPTIONS_ENDPOINT = '/billing/subscriptions'
export const BILLING_SUBSCRIPTIONS_WEBSOCKET_EVENT = 'account_${account_id}_billing_subscriptions'

export class BillingSubscriptionsService extends Api<T> {
	constructor() {
		super(BILLING_SUBSCRIPTIONS_ENDPOINT)
	}
}

export const billingSubscriptionsService = new BillingSubscriptionsService()
