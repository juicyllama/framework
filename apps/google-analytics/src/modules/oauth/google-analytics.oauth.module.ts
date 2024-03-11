import { Module } from '@nestjs/common'

import { OAuthModule } from '@juicyllama/app-store'

import { GoogleAnalyticsConfigModule } from '../config/google-analytics.config.module'
import { GoogleAnalyticsInstalledAppModule } from '../installed-app/google-analytics.installed-app.module'

import { GoogleAnalyticsOAuthService } from './google-analytics.oauth.service'
import { GoogleAnalyticsOAuthController } from './google-analytics.oauth.controller'
import { GoogleAnalyticsInstalledAppOAuthService } from './google-analytics.installed-app-oauth.service'

@Module({
	imports: [GoogleAnalyticsConfigModule, OAuthModule, GoogleAnalyticsInstalledAppModule],
	providers: [GoogleAnalyticsOAuthService, GoogleAnalyticsInstalledAppOAuthService],
	controllers: [GoogleAnalyticsOAuthController],
	exports: [GoogleAnalyticsOAuthService, GoogleAnalyticsInstalledAppOAuthService],
})
export class GoogleAnalyticsOAuthModule {}
