import Joi from 'joi'

export const configJoi = {
	BASE_URL_SHORTLINKS: Joi.string().required(),
}
