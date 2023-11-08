import Joi from 'joi'

export const systemConfigJoi = {
	SYSTEM_EMAIL_ADDRESS: Joi.string().required(),
	SYSTEM_EMAIL_NAME: Joi.string().required(),
	SYSTEM_DEFAULT_CURRENCY: Joi.string().required(),
	BASE_URL_API: Joi.string(),
	BASE_URL_APP: Joi.string(),
}
