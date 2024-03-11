import { Logger } from '@juicyllama/utils'
import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { jwtConfig } from '../../configs'
import { SSOConfigDto } from '../../configs/sso.config.dto'
import { MiddlewareAccountId } from '../../middleware'
import { Query } from '../../utils/typeorm/Query'
import { AccountModule } from '../accounts/account.module'
import { BeaconModule } from '../beacon/beacon.module'
import { ConfigValidationModule } from '../config'
import { SettingsModule } from '../settings/settings.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserAccount } from './user-account.entity'
import { AzureADStrategy, enableAzureADStrategy } from './strategies/azure.strategy'
import { BasicStrategy } from './strategies/basic.strategy'
import { CronStrategy } from './strategies/cron.strategy'
import { GoogleStrategy, enableGoogleStrategy } from './strategies/google.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LinkedinStrategy, enableLinkedinStrategy } from './strategies/linkedin.strategy'
import { LocalStrategy } from './strategies/local.strategy'

const strategies = []
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
		ConfigModule.forFeature(jwtConfig),
		ConfigValidationModule.register(SSOConfigDto),
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forFeature([UserAccount]),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => PassportModule),
		forwardRef(() => SettingsModule),
		forwardRef(() => UsersModule),
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, CronStrategy, BasicStrategy, Logger, Query, ...strategies],
	exports: [AuthService],
})
export class AuthModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MiddlewareAccountId)
	}
}
