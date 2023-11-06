import Joi from 'joi'

export const joiConfigJoi = {
	NODE_ENV: Joi.string().default('development'),
	TZ: Joi.string().default('UTC'),
	REDIS_HOST: Joi.string().default('localhost'),
	REDIS_PORT: Joi.number().default(6379),
	REDIS_PASSWORD: Joi.string(),
	MYSQL_HOSTNAME: Joi.string().default('localhost'),
	MYSQL_PORT: Joi.number().default(3306),
	MYSQL_USERNAME: Joi.string().default('root'),
	MYSQL_PASSWORD: Joi.string().default('localhost'),
	MYSQL_DB_NAME: Joi.string(),
	MONGODB_HOSTNAME: Joi.string(),
	MONGODB_PORT: Joi.number().default(27017),
	MONGODB_DATABASE: Joi.string(),
}
