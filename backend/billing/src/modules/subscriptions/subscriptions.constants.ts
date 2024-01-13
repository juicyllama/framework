import { Subscription } from './subscriptions.entity'
import { SubscriptionSelect, SubscriptionOrderBy, SubscriptionRelations } from './subscriptions.enums'

export const BILLING_SUBSCRIPTIONS_NAME = 'subscription'
export const BILLING_SUBSCRIPTIONS_PRIMARY_KEY = 'subscription_id'
export const BILLING_SUBSCRIPTIONS_SEARCH_FIELDS = ['name', 'description']
export const BILLING_SUBSCRIPTIONS_DEFAULT_ORDER_BY = 'next_rebill_at'
export const BILLING_SUBSCRIPTIONS_CURRENCY_FIELD = 'currency'
export const BILLING_SUBSCRIPTIONS_CURRENCY_FIELDS = ['amount_subtotal', 'amount_tax', 'amount_total']

export const CRON_BILLING_SUBSCRIPTIONS_REBILL_DOMAIN = 'billing::subscriptions::cron::service::rebill'

export const BILLING_SUBSCRIPTIONS_E = Subscription
export type BILLING_SUBSCRIPTIONS_T = Subscription

export const billingSubscriptionsConstants = {
	entity: BILLING_SUBSCRIPTIONS_E,
	name: BILLING_SUBSCRIPTIONS_NAME,
	primaryKey: BILLING_SUBSCRIPTIONS_PRIMARY_KEY,
	searchFields: BILLING_SUBSCRIPTIONS_SEARCH_FIELDS,
	defaultOrderBy: BILLING_SUBSCRIPTIONS_DEFAULT_ORDER_BY,
	currencyField: BILLING_SUBSCRIPTIONS_CURRENCY_FIELD, // the field that holds the currency e.g. 'USD'
	currencyFields: BILLING_SUBSCRIPTIONS_CURRENCY_FIELDS, // the fields that hold numeric values in the currency e.g. '123.45'. example values: ['subtotal_price', 'total_shipping', 'total_price']
	selectEnum: SubscriptionSelect,
	orderByEnum: SubscriptionOrderBy,
	relationsEnum: SubscriptionRelations,
}
