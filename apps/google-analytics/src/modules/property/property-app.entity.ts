import { InstalledApp } from '@juicyllama/app-store'

export class PropertyInstalledApp extends InstalledApp {
	settings: { GOOGLE_ANALYTICS_PROPERTY_ID: string }
}

export type InstalledAppLocator = Pick<PropertyInstalledApp, 'installed_app_id'>
