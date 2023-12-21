import { Enviroment, Env } from '@juicyllama/utils'
import { RawAxiosRequestConfig } from 'axios'

export function WiseApiUrl(): string {
	switch (Env.get()) {
		case Enviroment.production:
			return 'https://api.wise.com'
		default:
			return 'https://api.sandbox.transferwise.tech'
	}
}

export function WiseApiConfig(): RawAxiosRequestConfig {
	return {
		headers: {
			Authorization: `Bearer ${process.env.WISE_API_KEY}`,
		},
	}
}
