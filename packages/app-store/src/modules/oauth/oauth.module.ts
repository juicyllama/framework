import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Oauth } from './oauth.entity'
import { OauthService } from './oauth.service'
import { InstalledAppsModule } from '../installed/installed.module'
import { BeaconModule, Query } from '@juicyllama/core'

@Module({
	imports: [TypeOrmModule.forFeature([Oauth]), forwardRef(() => InstalledAppsModule), forwardRef(() => BeaconModule)],
	controllers: [],
	providers: [OauthService, Logger, Query],
	exports: [OauthService],
})
export class OAuthModule {}
