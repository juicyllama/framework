import { Injectable } from '@nestjs/common'

import { AppIntegrationStatus, InstalledAppsService } from '@juicyllama/app-store'
import { InstalledAppLocator, GoogleAnalyticsInstalledApp } from '../property/google-analytics.installed-app.entity'

@Injectable()
export class GoogleAnalyticsInstalledAppService {
	public static readonly AppNotFoundException = class AppNotFoundException extends Error {}
	public static readonly AppNotConfiguredException = class AppNotFoundException extends Error {
		constructor(public readonly property: string) {
			super()
		}
	}

	public constructor(private readonly installedAppsService: InstalledAppsService) {}

	public async load(id: number, accountId: number): Promise<GoogleAnalyticsInstalledApp> {
		const installedApp = (await this.installedAppsService.findOne({
			where: {
				installed_app_id: id,
				account_id: accountId,
			},
		})) as GoogleAnalyticsInstalledApp

		this.validate(installedApp)

		return installedApp
	}

	private validate(installedApp: GoogleAnalyticsInstalledApp) {
		if (!installedApp) {
			throw new GoogleAnalyticsInstalledAppService.AppNotFoundException()
		}

		if (!installedApp.settings.GOOGLE_ANALYTICS_PROPERTY_ID) {
			throw new GoogleAnalyticsInstalledAppService.AppNotConfiguredException('GOOGLE_ANALYTICS_PROPERTY_ID')
		}
	}

	public async recordConnected(installedApp: InstalledAppLocator) {
		await this.installedAppsService.update({
			installed_app_id: installedApp.installed_app_id,
			integration_status: AppIntegrationStatus.CONNECTED,
		})
	}
}
