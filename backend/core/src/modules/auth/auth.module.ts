import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import cacheConfig from '../../configs/cache.config.js'
import { databaseConfig, jwtConfig, ssoConfig } from '../../configs/index.js'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module.js'
import { AccountModule } from '../accounts/account.module.js'
import { LocalStrategy } from './strategies/local.strategy.js'
import { JwtStrategy } from './strategies/jwt.strategy.js'
import { Role } from './role.entity.js'
import { AuthService } from './auth.service.js'
import { CronStrategy } from './strategies/cron.strategy.js'
import { BasicStrategy } from './strategies/basic.strategy.js'
import { GoogleStrategy, enableGoogleStrategy } from './strategies/google.strategy.js'
import { AzureADStrategy, enableAzureADStrategy } from './strategies/azure.strategy.js'
import { Env, Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query.js'
import { BeaconModule } from '../beacon/beacon.module.js'
import { SettingsModule } from '../settings/settings.module.js'
import { AuthController } from './auth.controller.js'
import { MiddlewareAccountId } from '../../middleware/index.js'
import Joi from 'joi'
import { ssoConfigJoi } from '../../configs/sso.config.joi.js'
import { enableLinkedinStrategy, LinkedinStrategy } from './strategies/linkedin.strategy.js'

const strategies = [];
if (enableAzureADStrategy) {
	strategies.push(AzureADStrategy)
}
if (enableGoogleStrategy) {
	strategies.push(GoogleStrategy)
}
if (enableLinkedinStrategy) {
	strategies.push(LinkedinStrategy)
}

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig, jwtConfig, databaseConfig, ssoConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: Env.IsNotTest() ? Joi.object(ssoConfigJoi) : null,
		}),
		CacheModule.registerAsync(cacheConfig()),
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Role]),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => PassportModule),
		forwardRef(() => SettingsModule),
		forwardRef(() => UsersModule),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		CronStrategy,
		BasicStrategy,
		Logger,
		Query,
		...strategies
	],
	exports: [AuthService],
})
export class AuthModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MiddlewareAccountId)
	}
}
