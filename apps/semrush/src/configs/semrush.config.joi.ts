import Joi from 'joi'

export const semrushConfigJoi = {
	SEMRUSH_API_KEY: Joi.string().required(),
}
