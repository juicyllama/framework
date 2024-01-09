import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Oauth } from './oauth.entity'
import { OauthService } from './oauth.service'
import { InstalledAppsModule } from '../installed/installed.module'
import { BeaconModule, Query, AuthModule } from '@juicyllama/core'
import { OauthController } from './oauth.controller'
import { AppsModule } from '../apps.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([Oauth]),
		forwardRef(() => AuthModule),
		forwardRef(() => AppsModule),
		forwardRef(() => InstalledAppsModule),
		forwardRef(() => BeaconModule),
	],
	controllers: [OauthController],
	providers: [OauthService, Logger, Query],
	exports: [OauthService],
})
export class OAuthModule {}
