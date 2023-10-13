//A list of webhooks we currently support
export enum ShopifyWebhooksTopics {
	'orders/create' = 'orders/create',
	'orders/cancelled' = 'orders/cancelled',
	'orders/edited' = 'orders/edited',
	'orders/fulfilled' = 'orders/fulfilled',
	'orders/paid' = 'orders/paid',
	'orders/partially_fulfilled' = 'orders/partially_fulfilled',
	'orders/updated' = 'orders/updated',
	'customers/data_request' = 'customers/data_request',
	'customers/redact' = 'customers/redact',
	'shop/redact' = 'shop/redact',
}

//The routes for the webhooks
export enum ShopifyWebhooksTopicRoutes {
	'orders/create' = 'app/shopify/orders/webhook',
	'orders/cancelled' = 'app/shopify/orders/webhook',
	'orders/edited' = 'app/shopify/orders/webhook',
	'orders/fulfilled' = 'app/shopify/orders/webhook',
	'orders/paid' = 'app/shopify/orders/webhook',
	'orders/partially_fulfilled' = 'app/shopify/orders/webhook',
	'orders/updated' = 'app/shopify/orders/webhook',
	'customers/data_request' = 'app/shopify/customers/webhook/data_request',
	'customers/redact' = 'app/shopify/customers/webhook/redact',
	'shop/redact' = 'app/shopify/shop/webhook/redact',
}
