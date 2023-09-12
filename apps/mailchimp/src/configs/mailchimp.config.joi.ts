import Joi from 'joi'

export const mailchimpConfigJoi = {
	MAILCHIMP_API_KEY: Joi.string().required(),
	MAILCHIMP_SERVER_PREFIX: Joi.string().required(),
	MAILCHIMP_LIST_ID: Joi.string().required(),
}
