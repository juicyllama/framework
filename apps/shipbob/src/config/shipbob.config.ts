import { RawAxiosRequestConfig } from 'axios'
import { ShipbobConfigDto } from './shipbob.config.dto'

export function getShipbobApiKey(options?: ShipbobConfigDto): string {
	if (options?.installed_app?.settings?.SHIPBOB_PAT_TOKEN) {
		return options.installed_app.settings.SHIPBOB_PAT_TOKEN
	} else if (options?.env?.SHIPBOB_PAT_TOKEN) {
		return options.env.SHIPBOB_PAT_TOKEN
	} else if (process.env.SHIPBOB_PAT_TOKEN) {
		return process.env.SHIPBOB_PAT_TOKEN
	}
	throw new Error('Shipbob PAT token not found')
}

export function shipbobAxiosConfig(options?: ShipbobConfigDto): RawAxiosRequestConfig {
	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getShipbobApiKey(options)}`,
		},
	}
}
