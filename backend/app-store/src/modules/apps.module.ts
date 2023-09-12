import { forwardRef, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { AppsController } from './apps.controller'
import { AppsService } from './apps.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { App } from './apps.entity'
import { Logger } from '@juicyllama/utils'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { InstalledAppsModule } from './installed/installed.module'
import { LogsModule } from './app_logs/logs.module'
import { OAuthModule } from './oauth/oauth.module'
import {
	cacheConfig,
	jwtConfig,
	databaseConfig,
	Query,
	BeaconModule,
	AuthModule,
	AccountModule,
	UsersModule,
} from '@juicyllama/core'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
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
