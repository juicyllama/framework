export enum TransactionDiscountSelect {
	transaction_discount_id = 'transaction_discount_id',
	amount = 'amount',
	code = 'code',
	type = 'type',
}

export enum TransactionDiscountOrderBy {
	transaction_discount_id = 'transaction_discount_id',
	amount = 'amount',
	code = 'code',
	type = 'type',
	created_at = 'created_at',
	updated_at = 'updated_at',
}

export enum TransactionDiscountRelations {
	account = 'account',
	transaction = 'transaction',
}

export enum TransactionDiscountType {
	FIXED = 'FIXED',
	PERCENTAGE = 'PERCENTAGE',
	SHIPPING = 'SHIPPING',
}
