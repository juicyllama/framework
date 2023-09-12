import Joi from 'joi'

export const beaconConfigJoi = {
	SYSTEM_EMAIL_ADDRESS: Joi.string(),
	SYSTEM_EMAIL_NAME: Joi.string(),
	PUSHER_APP_ID: Joi.string(),
	PUSHER_APP_KEY: Joi.string(),
	PUSHER_APP_SECRET: Joi.string(),
	PUSHER_APP_CLUSTER: Joi.string(),
	PUSHER_USE_TLS: Joi.boolean().default(true),
	PUSHER_CHANNEL: Joi.string(),
}
