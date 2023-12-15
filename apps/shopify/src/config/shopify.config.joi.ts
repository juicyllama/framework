import Joi from 'joi'

export const shopifyConfigJoi = Joi.object({
	SHOPIFY_APP_CLIENT_ID: Joi.string().required(),
	SHOPIFY_APP_CLIENT_SECRET: Joi.string().required(),
	SHOPIFY_EXTRA_SCOPES: Joi.string().optional(),
	SHOPIFY_OAUTH_REDIRECT_URL: Joi.string().optional(),
	CRON_APP_SHOPIFY_SYNC_ORDERS: Joi.string().optional(),
	CRON_APP_SHOPIFY_SYNC_ORDERS_FREQUENCY: Joi.string().optional(),
})
