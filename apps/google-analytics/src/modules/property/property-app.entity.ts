import { InstalledApp } from '@juicyllama/app-store';

export class PropertyInstalledApp extends InstalledApp {
	settings: { GOOGLE_ANALYTICS_PROPERTY_ID: string }
}
