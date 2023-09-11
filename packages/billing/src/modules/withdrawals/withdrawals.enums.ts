export enum WithdrawalStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	COMPLETED = 'COMPLETED',
	MANUAL = 'MANUAL',
}

export enum WithdrawalSelect {
	withdrawal_id = 'withdrawal_id',
	amount = 'amount',
	currency = 'currency',
	status = 'status',
	created_at = 'created_at',
	updated_at = 'updated_at',
	deleted_at = 'deleted_at',
}

export enum WithdrawalOrderBy {
	withdrawal_id = 'withdrawal_id',
	amount = 'amount',
	currency = 'currency',
	created_at = 'created_at',
}

export enum WithdrawalRelations {
	account = 'account',
	payment_method = 'payment_method',
}
