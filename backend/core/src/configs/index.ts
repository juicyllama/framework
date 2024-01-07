//Configs

//todo move these to work like DB config for example

import beaconConfig from './beacon.config.js'
import cacheConfig from './cache.config.js'
import jwtConfig from './jwt.config.js'
import mongodbConfig from './mongodb.config.js'
import typeormConfig from './typeorm.config.js'
import { systemConfig } from './system.config.js'
import { systemConfigJoi } from './system.config.joi.js'
import { ssoConfig } from './sso.config.js'
import { loadEnvVariables } from './aws.secrets.js'
import { redocConfig } from './redoc.config.js'
import { joiConfigJoi } from './joi.config.js'
import { validationPipeOptions } from './nest.config.js'
import { databaseConfig } from './database.config.js'
import { RABBITMQ, rabbitMQConfig } from './rabbitmq.config.js'

export {
	beaconConfig,
	cacheConfig,
	jwtConfig,
	mongodbConfig,
	typeormConfig,
	systemConfig,
	systemConfigJoi,
	ssoConfig,
	loadEnvVariables,
	redocConfig,
	joiConfigJoi,
	validationPipeOptions,
	databaseConfig,
	RABBITMQ,
	rabbitMQConfig,
}
