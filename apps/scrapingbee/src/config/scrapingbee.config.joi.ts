import Joi from 'joi'

export const scrapingbeeConfigJoi = {
	SCRAPINGBEE_API_KEY: Joi.string().required(),
}
