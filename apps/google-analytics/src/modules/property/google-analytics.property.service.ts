import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { Injectable } from '@nestjs/common'

import { GoogleAnalyticsInstalledApp } from './google-analytics.installed-app.entity'
import { GoogleAnalyticsOAuthService } from '../oauth/google-analytics.oauth.service'
import { GoogleAnalyticsInstalledAppOAuthService } from '../oauth/google-analytics.installed-app-oauth.service'

@Injectable()
export class GoogleAnalyticsPropertyService {
	constructor(
		private readonly authService: GoogleAnalyticsOAuthService,
		private readonly installedAppAuthService: GoogleAnalyticsInstalledAppOAuthService,
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
		const tokens = await this.installedAppAuthService.loadSavedCredentials(installedApp)

		const client = this.authService.getAuthenticatedClient(tokens)
		const credentials = this.authService.createDataClientCredentials(client)

		return new BetaAnalyticsDataClient({ sslCreds: credentials })
	}
}
