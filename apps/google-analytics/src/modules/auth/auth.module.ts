import { Module } from '@nestjs/common'

import { InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'

import { GoogleAnalyticsConfigModule } from '../config/google-analytics.config.module'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { InstalledAppAuthService } from './installed-app-auth.service'

@Module({
	imports: [GoogleAnalyticsConfigModule, OAuthModule, InstalledAppsModule],
	providers: [AuthService, InstalledAppAuthService],
	controllers: [AuthController],
	exports: [AuthService, InstalledAppAuthService],
})
export class AuthModule {}
