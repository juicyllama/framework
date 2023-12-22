import { SupportedCurrencies } from "@juicyllama/vue-utils"
import { Account } from "../account"
import { Charge } from "./charge"
import { Payment } from "./payment"

export interface Wallet {
	readonly wallet_id: number
	account: Account
	account_id: number
	debit_balance?: number
	credit_balance?: number
	balance: number
	currency: SupportedCurrencies
	readonly charge?: Charge
	readonly payment?: Payment
	created_at?: Date
	updated_at?: Date
}
