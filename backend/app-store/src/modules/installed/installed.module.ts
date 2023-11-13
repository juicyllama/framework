import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { OAuthModule } from '../oauth/oauth.module'
import { InstalledApp } from './installed.entity'
import { InstalledAppsController } from './installed.controller'
import { InstalledAppsService } from './installed.service'
import { AppsModule } from '../apps.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule, AccountModule, Query, UsersModule, jwtConfig, BeaconModule } from '@juicyllama/core'
import { WordPressService } from './preinstall/wordpress.service'
import { ShopifyService } from './preinstall/shopify.service'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		TypeOrmModule.forFeature([InstalledApp]),
		forwardRef(() => AccountModule),
		forwardRef(() => AppsModule),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => UsersModule),
		forwardRef(() => OAuthModule),
	],
	controllers: [InstalledAppsController],
	providers: [InstalledAppsService, WordPressService, ShopifyService, Logger, Query],
	exports: [InstalledAppsService, WordPressService, ShopifyService],
})
export class InstalledAppsModule {}
