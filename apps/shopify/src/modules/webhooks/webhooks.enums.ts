//A list of webhooks we currently support
export enum ShopifyWebhooksTopics {
	'orders/create' = 'orders/create',
	'customers/data_request' = 'customers/data_request',
	'customers/redact' = 'customers/redact',
	'shop/redact' = 'shop/redact',
}

//The routes for the webhooks
export enum ShopifyWebhooksTopicRoutes {
	'orders/create' = 'app/shopify/orders/webhook/create',
	'customers/data_request' = 'app/shopify/customers/webhook/data_request',
	'customers/redact' = 'app/shopify/customers/webhook/redact',
	'shop/redact' = 'app/shopify/shop/webhook/redact',
}
