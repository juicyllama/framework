import Joi from 'joi'

export const xeroConfigJoi = {
	XERO_CC_CLIENT_ID: Joi.string().required(),
	XERO_CC_CLIENT_SECRET: Joi.string().required(),
	XERO_CC_DEFAULT_BANK_ACCOUNT_ID: Joi.string().required(),
	XERO_CC_WEBHOOK_SIGNING_KEY: Joi.string().required(),
}
