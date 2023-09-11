import Joi from 'joi'

export const slackConfigJoi = {
	SLACK_SIGNING_SECRET: Joi.string().required(),
	SLACK_BOT_TOKEN: Joi.string().required(),
}
