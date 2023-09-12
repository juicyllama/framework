import Joi from 'joi'

export const openaiConfigJoi = {
	OPENAI_API_KEY: Joi.string().required(),
}
