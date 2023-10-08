import { App, AppStoreIntegrationName } from './apps'
import { Account, User } from '@/types'

export enum AppScope {
	ACCOUNT = 'ACCOUNT',
}

export enum AppIntegrationStatus {
	CONNECTED = 'CONNECTED',
	DISCONNCTED = 'DISCONNECTED',
}

export interface ConnectAppOptions {
	integration_name: AppStoreIntegrationName
	icon?: {
		hide?: boolean
		size?: string
		color?: string
	}
	connection?: {
		name?: string
		hide?: boolean
	}
}

export interface InstalledApp {
	readonly installed_app_id: number
	app?: App
	name: string
	scope: AppScope
	settings?: any
	readonly integration_status?: AppIntegrationStatus
	readonly active: boolean
	readonly account?: Account
	readonly user?: User
	readonly oauth_redirect_url?: string
	last_check_at?: Date
	next_check_at?: Date
}
