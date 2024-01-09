import Joi from 'joi'

export const awsS3ConfigJoi = {
	AWS_S3_JL_PUBLIC_BUCKET: Joi.string().optional(),
	AWS_S3_JL_PRIVATE_BUCKET: Joi.string().optional(),
	AWS_S3_JL_REGION: Joi.string().optional(),
}
