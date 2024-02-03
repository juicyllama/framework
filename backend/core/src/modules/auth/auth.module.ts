import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { AccountModule } from '../accounts/account.module'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { Role } from './role.entity'
import { AuthService } from './auth.service'
import { CronStrategy } from './strategies/cron.strategy'
import { BasicStrategy } from './strategies/basic.strategy'
import { GoogleStrategy, enableGoogleStrategy } from './strategies/google.strategy'
import { AzureADStrategy, enableAzureADStrategy } from './strategies/azure.strategy'
import { Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query'
import { BeaconModule } from '../beacon/beacon.module'
import { SettingsModule } from '../settings/settings.module'
import { AuthController } from './auth.controller'
import { MiddlewareAccountId } from '../../middleware'
import { enableLinkedinStrategy, LinkedinStrategy } from './strategies/linkedin.strategy'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from '../../configs'

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
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forFeature([Role]),
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
