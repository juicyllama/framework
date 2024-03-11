import { Api } from '../../helpers'
import { Invoice } from '../../types'

type T = Invoice
export const BILLING_INVOICE_ENDPOINT = '/billing/invoices'
export const BILLING_INVOICE_PUSHER_EVENT = 'account_${account_id}_billing_invoices'

export class BillingInvoiceService extends Api<T> {
	constructor() {
		super(BILLING_INVOICE_ENDPOINT)
	}
}

export const billingInvoiceService = new BillingInvoiceService()
