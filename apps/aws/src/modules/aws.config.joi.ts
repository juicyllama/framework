import Joi from 'joi'

export const awsConfigJoi = {
	AWS_JL_REGION: Joi.string().default('eu-west-2'),
	AWS_JL_ACCESS_KEY_ID: Joi.string().required(),
	AWS_JL_SECRET_KEY_ID: Joi.string().required(),
}
