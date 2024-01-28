import { AuthModule, AccountModule, Query, UsersModule, BeaconModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppsModule } from '../apps.module'
import { OAuthModule } from '../oauth/oauth.module'
import { InstalledAppsController } from './installed.controller'
import { InstalledApp } from './installed.entity'
import { InstalledAppsService } from './installed.service'
import { ShopifyService } from './preinstall/shopify.service'
import { WordPressService } from './preinstall/wordpress.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([InstalledApp]),
		AccountModule,
		AppsModule,
		AuthModule,
		BeaconModule,
		UsersModule,
		OAuthModule,
	],
	controllers: [InstalledAppsController],
	providers: [InstalledAppsService, WordPressService, ShopifyService, Logger, Query],
	exports: [InstalledAppsService, WordPressService, ShopifyService],
})
export class InstalledAppsModule {}
