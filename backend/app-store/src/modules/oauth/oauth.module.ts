import { BeaconModule, Query, AuthModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppsModule } from '../apps.module'
import { Oauth } from './oauth.entity'
import { OauthService } from './oauth.service'
import { OauthController } from './oauth.controller'

@Module({
	imports: [TypeOrmModule.forFeature([Oauth]), AuthModule, AppsModule, BeaconModule],
	controllers: [OauthController],
	providers: [OauthService, Logger, Query],
	exports: [OauthService],
})
export class OAuthModule {}
