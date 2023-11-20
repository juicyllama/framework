import Joi from 'joi'

export const awsRdsConfigJoi = {
	AWS_RDS_JL_REGION: Joi.string().default('eu-west-2'),
}
