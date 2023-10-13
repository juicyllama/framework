import Joi from 'joi'

export const shopifyConfigJoi = {
	SHOPIFY_APP_CLIENT_ID: Joi.string().required(),
	SHOPIFY_APP_CLIENT_SECRET: Joi.string().required(),
	SHOPIFY_EXTRA_SCOPES: Joi.string().optional()
}
