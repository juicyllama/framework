import { SupportedCurrencies } from '@juicyllama/utils'
import { Account } from '../account'
import { Invoice } from './invoice'
import { Tag } from '../tags'
import { User } from '../user'

export interface Charge {
	readonly charge_id: number
	account: Account
	account_id: number
	name: string
	description: string
	amount_subtotal?: number
	amount_tax?: number
	amount_total: number
	currency: SupportedCurrencies
	tags?: Tag[]
	invoice?: Invoice
	is_invoiced?: boolean
	added_by?: User
	added_by_user_id?: number
	created_at?: Date
	updated_at?: Date
}
