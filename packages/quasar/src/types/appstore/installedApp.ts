import { App } from './apps'
import { Account, User } from '@/types'

export enum AppScope {
	ACCOUNT = 'ACCOUNT',
}

export enum AppIntegrationStatus {
	CONNECTED = 'CONNECTED',
	DISCONNCTED = 'DISCONNECTED',
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
	last_check_at?: Date
	next_check_at?: Date
}
