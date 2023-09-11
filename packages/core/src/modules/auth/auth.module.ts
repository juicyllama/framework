import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import cacheConfig from '../../configs/cache.config'
import { databaseConfig, jwtConfig, ssoConfig } from '../../configs'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { AccountModule } from '../accounts/account.module'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { Role } from './role.entity'
import { AuthService } from './auth.service'
import { CronStrategy } from './strategies/cron.strategy'
import { BasicStrategy } from './strategies/basic.strategy'
import { GoogleStrategy } from './strategies/google.strategy'
import { AzureADStrategy } from './strategies/azure.strategy'
import { Env, Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query'
import { BeaconModule } from '../beacon/beacon.module'
import { SettingsModule } from '../settings/settings.module'
import { AuthController } from './auth.controller'
import { MiddlewareAccountId } from '../../middleware'
import Joi from 'joi'
import { ssoConfigJoi } from '../../configs/sso.config.joi'

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
		GoogleStrategy,
		AzureADStrategy,
		Logger,
		Query,
	],
	exports: [AuthService],
})
export class AuthModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MiddlewareAccountId)
	}
}
