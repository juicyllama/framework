import { Invoice } from './invoices.entity'
import { InvoiceSelect, InvoiceOrderBy, InvoiceRelations } from './invoices.enums'

export const BILLING_INVOICES_NAME = 'invoice'
export const BILLING_INVOICES_E = Invoice
export type BILLING_INVOICES_T = Invoice
export const BILLING_INVOICES_SEARCH_FIELDS = ['amount_total']
export const BILLING_INVOICES_ORDER_BY = 'created_at'
export const BILLING_INVOICES_PRIMARY_KEY = 'invoice_id'
export const BILLING_INVOICES_CURRENCY_FIELD = 'currency'
export const BILLING_INVOICES_CURRENCY_FIELDS = ['amount_subtotal', 'amount_tax', 'amount_total', 'amount_paid']

export const CRON_BILLING_INVOICES_GENERATE_DOMAIN = 'billing::invoices::cron::service::generateInvoices'
export const CRON_BILLING_INVOICES_RESEND_DOMAIN = 'billing::invoices::cron::service::resendInvoices'
export const CRON_BILLING_INVOICES_SETTLE_DOMAIN = 'billing::invoices::cron::service::settleInvoices'

export const billingInvoiceConstants = {
    entity: BILLING_INVOICES_E,
    name: BILLING_INVOICES_NAME,
    primaryKey: BILLING_INVOICES_PRIMARY_KEY,
    searchFields: BILLING_INVOICES_SEARCH_FIELDS,
    defaultOrderBy: BILLING_INVOICES_ORDER_BY,
    currencyField: BILLING_INVOICES_CURRENCY_FIELD,
    currencyFields: BILLING_INVOICES_CURRENCY_FIELDS,
    selectEnum: InvoiceSelect,
	orderByEnum: InvoiceOrderBy,
	relationsEnum: InvoiceRelations,
}