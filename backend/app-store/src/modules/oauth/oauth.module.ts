import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Oauth } from './oauth.entity'
import { OauthService } from './oauth.service'
import { InstalledAppsModule } from '../installed/installed.module'
import { BeaconModule, Query, systemConfig } from '@juicyllama/core'
import { OauthController } from './oauth.controller'
import { ConfigModule } from '@nestjs/config'
import { AppsModule } from '../apps.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [systemConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		TypeOrmModule.forFeature([Oauth]), 
		forwardRef(() => AppsModule), 
		forwardRef(() => InstalledAppsModule), 
		forwardRef(() => BeaconModule)
	],
	controllers: [OauthController],
	providers: [OauthService, Logger, Query],
	exports: [OauthService],
})
export class OAuthModule {}
