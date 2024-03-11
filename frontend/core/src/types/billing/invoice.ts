import { SupportedCurrencies } from '@juicyllama/utils'
import { Account } from '../account'
import { AppStoreIntegrationName } from '../appstore'
import { Charge } from './charge'
import { Payment } from './payment'

export interface Invoice {
	readonly invoice_id: number
	account: Account
	account_id: number
	app_integration_name?: AppStoreIntegrationName
	app_invoice_id?: number
	currency: SupportedCurrencies
	amount_subtotal?: number
	amount_tax?: number
	amount_total: number
	amount_paid?: number
	charges?: Charge[]
	payments?: Payment[]
	paid_at?: Date
	created_at?: Date
	updated_at?: Date
}
