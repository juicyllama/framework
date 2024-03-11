import { InstalledApp } from '@juicyllama/app-store'

export class GoogleAnalyticsInstalledApp extends InstalledApp {
	settings: { GOOGLE_ANALYTICS_PROPERTY_ID: string }
}

export type InstalledAppLocator = Pick<InstalledApp, 'installed_app_id'>
