export enum ChargeSelect {
	charge_id = 'charge_id',
	name = 'name',
	description = 'description',
	amount = 'amount',
	currency = 'currency',
	is_invoiced = 'is_invoiced',
	created_at = 'created_at',
}

export enum ChargeOrderBy {
	charge_id = 'charge_id',
	amount = 'amount',
	currency = 'currency',
	is_invoiced = 'is_invoiced',
	created_at = 'created_at',
}

export enum ChargeRelations {
	account = 'account',
	added_by = 'added_by',
	tags = 'tags',
	invoice = 'invoice',
}
