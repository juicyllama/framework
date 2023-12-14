import { InstalledApp } from '@juicyllama/app-store'
import { registerAs } from '@nestjs/config'
import { AhrefsConfigDto } from './ahrefs.config.dto'
import { RawAxiosRequestConfig } from 'axios'

export default registerAs(
	'ahrefs',
	() =>
		<any>{
			AHREFS_API_KEY: process.env.AHREFS_API_KEY,
		},
)

export function getAhrefsApiKey(options?: {
	config?: AhrefsConfigDto,
	instlled_app?: InstalledApp,
	}): string 
{
	if(options?.instlled_app?.settings?.AHREFS_API_KEY) {
		return options.instlled_app.settings.AHREFS_API_KEY
	}else if(options?.config?.AHREFS_API_KEY) {
		return options.config.AHREFS_API_KEY
	}else if(process.env.AHREFS_API_KEY) {
		return process.env.AHREFS_API_KEY
	}
}

export function getAhrefsAxiosConfig(options?: {
	config?: AhrefsConfigDto,
	instlled_app?: InstalledApp,
	}): RawAxiosRequestConfig {
	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getAhrefsApiKey(options)}`,
		},
	}
}