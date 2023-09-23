import instance from './index.js'
import { accountStore } from '../index.js'
import { SupportedCurrencies } from '@juicyllama/utils'

export const BILLING_WALLET_ENDPOINT = '/billing/wallet'
export const BILLING_INVOICE_ENDPOINT = 'billing/invoices'

//todo move to /types/billng.ts and fully type
type InvoiceAPIResponse = {
	data: object
}

export async function getInvoiceById(
	invoice_id: number,
	select?: string,
	relations?: string,
): Promise<InvoiceAPIResponse> {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
	return await instance.get(`${BILLING_INVOICE_ENDPOINT}/${invoice_id}?select=${select}&relations=${relations}`)
}

export async function getBalance(currency: SupportedCurrencies): Promise<number> {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
	const result = await instance.get(`${BILLING_WALLET_ENDPOINT}/balances`)

	if (result?.data?.length) {
		const balance = result.data.find((b: any) => b.currency === currency)
		return balance.balance
	} else {
		return 0
	}
}
