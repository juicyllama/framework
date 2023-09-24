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

export * from './aws.secrets.js'
export * from './redoc.config.js'
export * from './joi.config.js'
export * from './nest.config.js'
export * from './database.config.js'
export * from './rabbitmq.config.js'
export { beaconConfig, cacheConfig, jwtConfig, mongodbConfig, typeormConfig, systemConfig, systemConfigJoi, ssoConfig }
