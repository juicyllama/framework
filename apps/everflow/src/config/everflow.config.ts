import { EverflowConfigDto } from './everflow.config.dto'
import { RawAxiosRequestConfig } from 'axios'

export function getEverflowAxiosConfig(config: EverflowConfigDto): RawAxiosRequestConfig {
	return {
		headers: {
			'Content-Type': 'application/json',
			'X-Eflow-API-Key': config.EVERFLOW_API_KEY ?? process.env.EVERFLOW_API_KEY,
		},
		timeout: process.env.SYSTEM_TIMEOUT ? Number(process.env.SYSTEM_TIMEOUT) : 10000,
		timeoutErrorMessage: 'Failed to connect to everflow - operation timed out!',
	}
}
