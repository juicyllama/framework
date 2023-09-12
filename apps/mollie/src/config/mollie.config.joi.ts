import Joi from 'joi'

export const moillieConfigJoi = {
	MOLLIE_API_KEY: Joi.string().required(),
}
