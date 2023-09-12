import Joi from 'joi'

export const awsSesConfigJoi = {
	AWS_SES_JL_REGION: Joi.string().default('eu-west-2'),
	AWS_SES_JL_TEMPLATE_ARN: Joi.string(),
}
