import { Module } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'

import { GoogleAnalyticsOAuthModule } from '../oauth/google-analytics.oauth.module'
import { GoogleAnalyticsInstalledAppModule } from '../installed-app/google-analytics.installed-app.module'

import { GoogleAnalyticsPropertyController } from './google-analytics.property.controller'
import { GoogleAnalyticsPropertyService } from './google-analytics.property.service'

@Module({
	imports: [GoogleAnalyticsOAuthModule, GoogleAnalyticsInstalledAppModule],
	controllers: [GoogleAnalyticsPropertyController],
	providers: [GoogleAnalyticsPropertyService, Logger],
})
export class GoogleAnalyticsPropertyModule {}
