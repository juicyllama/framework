import Joi from 'joi'

export const googleConfigJoi = {
	GOOGLE_MAPS_API_KEY: Joi.string().required(),
}
