import { SupportedCurrencies } from '@juicyllama/utils'
import { Account } from '../account'
import { User } from '../user'

export declare enum SubscriptionFrequency {
	DAILY = 1,
	WEEKLY = 7,
	BIWEEKLY = 14,
	MONTHLY = 30,
	BIMONTHLY = 60,
	QUARTERLY = 90,
	BIQUARTERLY = 180,
	YEARLY = 365,
}

export interface Subscription {
	readonly subscription_id: number
	readonly account?: Account
	readonly account_id?: number
	name: string
	description: string
	amount_subtotal?: number
	amount_tax?: number
	amount_total: number
	currency: SupportedCurrencies
	frequency: SubscriptionFrequency
	tags?: any[] //todo type
	added_by?: User
	readonly added_by_user_id?: number
	next_rebill_at?: Date
	paused_at?: Date
}
