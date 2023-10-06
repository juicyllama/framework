export enum ShopifyOrderFinancialStatus {
	pending = 'pending',
	authorized = 'authorized',
	partially_paid = 'partially_paid',
	paid = 'paid',
	partially_refunded = 'partially_refunded',
	refunded = 'refunded',
	voided = 'voided',
}

export enum ShopifyOrderFulfillmentStatus {
	fulfilled = 'fulfilled',
	null = 'null',
	partial = 'partial',
	restocked = 'restocked',
}

export enum ShopifyOrderDicountCodeType {
	fixed_amount = 'fixed_amount',
	percentage = 'percentage',
	shipping = 'shipping',
}
