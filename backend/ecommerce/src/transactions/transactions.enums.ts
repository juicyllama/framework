export enum TransactionSelect {
	transaction_id = 'transaction_id',
	order_id = 'order_id',
	order_number = 'order_number',
	payment_status = 'payment_status',
	fulfillment_status = 'fulfillment_status',
	currency = 'currency',
	subtotal_price = 'subtotal_price',
	total_discounts = 'total_discounts',
	total_tax = 'total_tax',
	total_outstanding = 'total_outstanding',
	total_price = 'total_price',
	test = 'test',
	cancelled_at = 'cancelled_at',
	cancel_reason = 'cancel_reason',
	refunded_at = 'refunded_at',
	created_at = 'created_at',
	updated_at = 'updated_at'
}

export enum TransactionOrderBy {
	transaction_id = 'transaction_id',
	order_id = 'order_id',
	order_number = 'order_number',
	payment_status = 'payment_status',
	fulfillment_status = 'fulfillment_status',
	currency = 'currency',
	subtotal_price = 'subtotal_price',
	total_discounts = 'total_discounts',
	total_tax = 'total_tax',
	total_outstanding = 'total_outstanding',
	total_price = 'total_price',
	test = 'test',
	cancelled_at = 'cancelled_at',
	refunded_at = 'refunded_at',
	created_at = 'created_at',
	updated_at = 'updated_at'
}

export enum TransactionRelations {
	account = 'account',
	store = 'store',
	shipping_contact = 'shipping_contact',
	billing_contact = 'billing_contact',
}

export enum TransactionPaymentStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	REFUNDED = 'REFUNDED',
	PATRIALREFUND = 'PATRIALREFUND',
	CANCELLED = 'CANCELLED',
	CHARGEDBACK = 'CHARGEDBACK',
}


export enum TransactionFulfillmentStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	SHIPPED = 'SHIPPED',
	DELIVERED = 'DELIVERED',
	CANCELLED = 'CANCELLED',
	RETURNED = 'RETURNED',
	EXCHANGED = 'EXCHANGED',
}