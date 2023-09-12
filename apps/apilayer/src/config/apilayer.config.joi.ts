import Joi from 'joi'

export const apilayerConfigJoi = {
	APILAYER_API_KEY: Joi.string().required(),
}
