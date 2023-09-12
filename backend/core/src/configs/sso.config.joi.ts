import Joi from 'joi'

export const defaultSSOString = 'TODO'
export const ssoConfigJoi = {
	FACEBOOK_APP_ID: Joi.string().default(defaultSSOString),
	FACEBOOK_APP_SECRET: Joi.string().default(defaultSSOString),
	GOOGLE_CLIENT_ID: Joi.string().default(defaultSSOString),
	GOOGLE_CLIENT_SECRET: Joi.string().default(defaultSSOString),
	AZURE_AD_CLIENT_ID: Joi.string().default(defaultSSOString),
	AZURE_AD_TENANT_ID: Joi.string().default(defaultSSOString),
}
