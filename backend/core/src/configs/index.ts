//Configs

//todo move these to work like DB config for example

import beaconConfig from './beacon.config'
import cacheConfig from './cache.config'
import jwtConfig from './jwt.config'
import mongodbConfig from './mongodb.config'
import typeormConfig from './typeorm.config'
import { systemConfig } from './system.config'
import { systemConfigJoi } from './system.config.joi'
import { ssoConfig } from './sso.config'
import { loadEnvVariables } from './aws.secrets'
import { redocConfig } from './redoc.config'
import { joiConfigJoi } from './joi.config'
import { validationPipeOptions } from './nest.config'
import { databaseConfig } from './database.config'
import { RABBITMQ, rabbitMQConfig} from './rabbitmq.config'

export { beaconConfig, cacheConfig, jwtConfig, mongodbConfig, typeormConfig, systemConfig, systemConfigJoi, ssoConfig, loadEnvVariables, redocConfig, joiConfigJoi, validationPipeOptions, databaseConfig, RABBITMQ, rabbitMQConfig }
