import Joi from 'joi'

export const wiseConfigJoi = {
	WISE_API_KEY: Joi.string().required(),
	WISE_PROFILE_ID: Joi.string().required(),
	WISE_BALANCE_IDS: Joi.string().required(),
}
