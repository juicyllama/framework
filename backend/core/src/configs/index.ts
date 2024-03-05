//Configs

//todo move these to work like DB config for example

import { BeaconConfigDto } from './beacon.config.dto'
import cacheConfig from './cache.config'
import jwtConfig from './jwt.config'
import mongodbConfig from './mongodb.config'
import typeormConfig from './typeorm.config'
import { systemConfig } from './system.config'
import { systemConfigJoi } from './system.config.joi'
import { SSOConfigDto } from './sso.config.dto'
import { loadEnvVariables } from './aws.secrets'
import { redocConfig } from './redoc.config'
import { joiConfigJoi } from './joi.config'
import { validationPipeOptions } from './nest.config'
import { databaseConfig } from './database.config'
import { RABBITMQ, rabbitMQConfig } from './rabbitmq.config'

export {
	BeaconConfigDto,
	cacheConfig,
	jwtConfig,
	mongodbConfig,
	typeormConfig,
	systemConfig,
	systemConfigJoi,
	SSOConfigDto,
	loadEnvVariables,
	redocConfig,
	joiConfigJoi,
	validationPipeOptions,
	databaseConfig,
	RABBITMQ,
	rabbitMQConfig,
}
