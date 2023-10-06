//A list of webhooks we currently support
export enum ShopifyWebhooksTopics {
    'orders/create' = 'orders/create',
}

//The routes for the webhooks
export enum ShopifyWebhooksTopicRoutes {
    'orders/create' = 'app/shopify/orders/webhook/create',
}