export enum WalletSelect {
	wallet_id = 'wallet_id',
	debit_balance = 'debit_balance',
	credit_balance = 'credit_balance',
	balance = 'balance',
	created_at = 'created_at',
}

export enum WalletOrderBy {
	wallet_id = 'wallet_id',
	created_at = 'created_at',
}

export enum WalletRelations {
	account = 'account',
	charge = 'charge',
	payment = 'payment',
}
