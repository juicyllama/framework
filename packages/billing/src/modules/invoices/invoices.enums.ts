export enum InvoiceSelect {
	invoice_id = 'invoice_id',
	app_integration_name = 'app_integration_name',
	currency = 'currency',
	app_invoice_id = 'app_invoice_id',
	amount_total = 'amount_total',
	amount_due = 'amount_due',
	amount_paid = 'amount_paid',
	created_at = 'created_at',
	updated_at = 'updated_at',
	paid_at = 'paid_at',
	is_paid = 'is_paid',
}

export enum InvoiceRelations {
	account = 'account',
}

export enum InvoiceOrderBy {
	invoice_id = 'invoice_id',
	amount = 'amount',
	currency = 'currency',
	amount_due = 'amount_due',
	amount_paid = 'amount_paid',
	created_at = 'created_at',
	updated_at = 'updated_at',
	paid_at = 'paid_at',
}
