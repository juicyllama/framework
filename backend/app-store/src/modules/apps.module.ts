import { forwardRef, Module } from '@nestjs/common'
import { AppsController } from './apps.controller'
import { AppsService } from './apps.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { App } from './apps.entity'
import { Logger } from '@juicyllama/utils'
import { InstalledAppsModule } from './installed/installed.module'
import { LogsModule } from './app_logs/logs.module'
import { OAuthModule } from './oauth/oauth.module'
import { Query, BeaconModule, AuthModule, AccountModule, UsersModule, systemConfig } from '@juicyllama/core'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		ConfigModule.forFeature(systemConfig),
		TypeOrmModule.forFeature([App]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => InstalledAppsModule),
		forwardRef(() => LogsModule),
		forwardRef(() => OAuthModule),
		forwardRef(() => UsersModule),
	],
	controllers: [AppsController],
	providers: [AppsService, Logger, Query],
	exports: [AppsService],
})
export class AppsModule {}
