import { Module } from '@nestjs/common'

import { InstalledAppsModule } from '@juicyllama/app-store'

import { GoogleAnalyticsInstalledAppService } from './google-analytics.installed-app.service'

@Module({
	imports: [InstalledAppsModule],
	providers: [GoogleAnalyticsInstalledAppService],
	exports: [GoogleAnalyticsInstalledAppService],
})
export class GoogleAnalyticsInstalledAppModule {}
