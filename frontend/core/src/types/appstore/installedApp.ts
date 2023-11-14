import { App, AppStoreIntegrationName } from './apps'
import { Account, Icon, User } from '../../types'

export enum AppScope {
	ACCOUNT = 'ACCOUNT',
}

export enum AppIntegrationStatus {
	CONNECTED = 'CONNECTED',
	DISCONNCTED = 'DISCONNECTED',
}

export interface ConnectAppOptionsOverrides {
	key: string
	value?: string
	hide?: boolean
}

export interface AppStoreOptions {
	connection_screen_settings?: AppStoreConnectionScreenSettings
	text?: {
		classes: string
	}
	icon?: Icon
}

export interface ConnectAppOptions extends AppStoreConnectionScreenSettings {
	integration_name: AppStoreIntegrationName
}

export interface AppStoreConnectionScreenSettings {
	// Manipulate the icon
	icon?: {
		hide?: boolean
		size?: string
		color?: string
	}
	// Manipulate the connection name field
	connection?: {
		name?: string
		hide?: boolean
	},
	// Allows user to override the default value of a field and/or hide it
	overrides?: ConnectAppOptionsOverrides[]
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

export interface preInstallCheckResponse {
	result: boolean
	error?: string
}