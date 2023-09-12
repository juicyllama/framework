export enum PaymentMethodStatus {
	pending = 'pending',
	active = 'active',
	disabled = 'disabled',
}

export enum PaymentMethodType {
	creditcard = 'creditcard',
	banktransfer = 'banktransfer',
}

export enum PaymentMethodRelations {
	account = 'account',
}

export enum PaymentMethodOrderBy {
	payment_method_id = 'payment_method_id',
	method = 'method',
	next_attempt_at = 'next_attempt_at',
	attempts = 'attempts',
	status = 'status',
	created_at = 'created_at',
	updated_at = 'updated_at',
}

export enum PaymentMethodSelect {
	payment_method_id = 'payment_method_id',
	method = 'method',
	details = 'details',
	can_send = 'can_send',
	can_charge = 'can_charge',
	can_refund = 'can_refund',
	app_integration_name = 'app_integration_name',
	next_attempt_at = 'next_attempt_at',
	attempts = 'attempts',
	status = 'status',
	redirect_url = 'redirect_url',
	created_at = 'created_at',
	updated_at = 'updated_at',
}
