import Joi from 'joi'

export const pexelsConfigJoi = {
	PEXELS_API_KEY: Joi.string().required(),
}
