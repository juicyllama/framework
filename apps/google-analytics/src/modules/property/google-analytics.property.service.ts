import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { Injectable } from '@nestjs/common'

import { GoogleAnalyticsInstalledApp } from './google-analytics.installed-app.entity'
import { GoogleAnalyticsOAuthService } from '../oauth/google-analytics.oauth.service'
import { GoogleAnalyticsInstalledAppOAuthService } from '../oauth/google-analytics.installed-app-oauth.service'

@Injectable()
export class GoogleAnalyticsPropertyService {
	constructor(
		private readonly googleAnalyticsOAuthService: GoogleAnalyticsOAuthService,
		private readonly googleAnalyticsInstalledAppOAuthService: GoogleAnalyticsInstalledAppOAuthService,
	) {}

	async runReport(installedApp: GoogleAnalyticsInstalledApp, payload: Object) {
		const analyticsData = await this.createAnalyticsDataClient(installedApp)

		const [response] = await analyticsData.runReport({
			...payload,
			property: `properties/${installedApp.settings.GOOGLE_ANALYTICS_PROPERTY_ID}`,
		})

		return response
	}

	private async createAnalyticsDataClient(installedApp: GoogleAnalyticsInstalledApp) {
		const tokens = await this.googleAnalyticsInstalledAppOAuthService.loadSavedCredentials(installedApp)

		const client = this.googleAnalyticsOAuthService.getAuthenticatedClient(tokens)
		const credentials = this.googleAnalyticsOAuthService.createDataClientCredentials(client)

		return new BetaAnalyticsDataClient({ sslCreds: credentials })
	}
}
