import Joi from 'joi'

export const spyfuConfigJoi = {
	SPYFU_API_KEY: Joi.string().required(),
}
