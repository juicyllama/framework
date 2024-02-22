import { Api } from '../../helpers'
import { Wallet } from '../../types'

type T = Wallet
export const BILLING_WALLET_ENDPOINT = '/billing/wallet'
export const BILLING_WALLET_PUSHER_EVENT = 'account_${account_id}_billing_wallet'

export class BillingWalletService extends Api<T> {
	constructor() {
		super(BILLING_WALLET_ENDPOINT)
	}
}

export const billingWalletService = new BillingWalletService()
