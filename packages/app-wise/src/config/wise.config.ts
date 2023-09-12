import { registerAs } from '@nestjs/config'
import { Enviroment, Env } from '@juicyllama/utils'
import { RawAxiosRequestConfig } from 'axios'
export default registerAs(
	'wise',
	() =>
		<any>{
			apiKey: process.env.WISE_API_KEY,
			profileId: process.env.WISE_PROFILE_ID,
			balanceIds: process.env.WISE_BALANCE_IDS,
		},
)

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
