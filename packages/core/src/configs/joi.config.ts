import Joi from 'joi'

export const joiConfigJoi = {
	NODE_ENV: Joi.string().required(),
	TZ: Joi.string().default('UTC'),
	REDIS_HOST: Joi.string().required(),
	REDIS_PORT: Joi.number().default(6379),
	REDIS_PASSWORD: Joi.string(),
	MYSQL_HOSTNAME: Joi.string().required(),
	MYSQL_PORT: Joi.number().default(3306),
	MYSQL_USERNAME: Joi.string().required(),
	MYSQL_PASSWORD: Joi.string().required(),
	MYSQL_DB_NAME: Joi.string().required(),
	MONGODB_HOSTNAME: Joi.string(),
	MONGODB_PORT: Joi.number().default(27017),
	MONGODB_DATABASE: Joi.string(),
}
