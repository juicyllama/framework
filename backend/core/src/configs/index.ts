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

export * from './aws.secrets'
export * from './redoc.config'
export * from './joi.config'
export * from './nest.config'
export * from './database.config'
export * from './rabbitmq.config'
export { beaconConfig, cacheConfig, jwtConfig, mongodbConfig, typeormConfig, systemConfig, systemConfigJoi, ssoConfig }
