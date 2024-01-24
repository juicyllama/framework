import Joi from 'joi'

export const ahrefsConfigJoi = Joi.object({
	AHREFS_API_KEY: Joi.string().optional(),
})
