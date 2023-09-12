import { Account } from '@juicyllama/core'
import { Dates, SupportedCurrencies } from '@juicyllama/utils'

export function toXeroInvoice(options: {
	account: Account
	currency: SupportedCurrencies
	amount_subtotal: number
	amount_tax: number
	amount_total: number
	lineItems: any[]
	invoice_date: Date
}): any {
	for (const li in options.lineItems) {
		options.lineItems[li].unitAmount = Number(Number(options.lineItems[li].unitAmount).toFixed(4))
		options.lineItems[li].taxAmount = Number(Number(options.lineItems[li].taxAmount).toFixed(4))
		options.lineItems[li].lineAmount = Number(Number(options.lineItems[li].lineAmount).toFixed(4))
	}

	return {
		total: Number(Number(options.amount_total).toFixed(4)),
		totalTax: Number(Number(options.amount_tax).toFixed(4)),
		subTotal: Number(Number(options.amount_subtotal).toFixed(4)),
		type: 'ACCREC',
		date: Dates.format(options.invoice_date, 'YYYY-MM-DD'),
		dueDate: Dates.format(options.invoice_date, 'YYYY-MM-DD'),
		lineItems: options.lineItems,
		reference: `${options.account.account_id}-${options.invoice_date.getFullYear()}-${
			options.invoice_date.getMonth() + 1
		}-${options.invoice_date.getDate()}`,
		status: 'AUTHORISED',
		currencyCode: options.currency,
		amountDue: Number(Number(options.amount_total).toFixed(4)),
		amountPaid: 0.0,
	}
}
