import { InstalledApp } from '@juicyllama/app-store'
import { RawAxiosRequestConfig } from 'axios'
import { AhrefsConfigDto } from './ahrefs.config.dto'

export function getAhrefsApiKey(options?: { config?: AhrefsConfigDto; installed_app?: InstalledApp }): string {
	if (options?.installed_app?.settings?.AHREFS_API_KEY) {
		return options.installed_app.settings.AHREFS_API_KEY
	} else if (options?.config?.AHREFS_API_KEY) {
		return options.config.AHREFS_API_KEY
	} else if (process.env.AHREFS_API_KEY) {
		return process.env.AHREFS_API_KEY
	}
}

export function getAhrefsAxiosConfig(options?: {
	config?: AhrefsConfigDto
	installed_app?: InstalledApp
}): RawAxiosRequestConfig {
	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getAhrefsApiKey(options)}`,
		},
	}
}
