import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { Injectable } from '@nestjs/common'

import { PropertyInstalledApp } from './property-app.entity'
import { AuthService } from '../auth/auth.service'
import { InstalledAppAuthService } from '../auth/installed-app-auth.service'

@Injectable()
export class PropertyService {
	constructor(
		private readonly authService: AuthService,
		private readonly installedAppAuthService: InstalledAppAuthService,
	) {}

	async runReport(installedApp: PropertyInstalledApp, payload: Object) {
		const analyticsData = await this.createAnalyticsDataClient(installedApp)

		const [response] = await analyticsData.runReport({
			...payload,
			property: `properties/${installedApp.settings.GOOGLE_ANALYTICS_PROPERTY_ID}`,
		})

		return response
	}

	private async createAnalyticsDataClient(installedApp: PropertyInstalledApp) {
		const tokens = await this.installedAppAuthService.loadSavedCredentials(installedApp)

		const client = this.authService.getAuthenticatedClient(tokens)
		const credentials = this.authService.createDataClientCredentials(client)

		return new BetaAnalyticsDataClient({ sslCreds: credentials })
	}
}
