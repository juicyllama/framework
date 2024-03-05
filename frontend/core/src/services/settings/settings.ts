import { Api, apiRequest } from '../../helpers'
import { Setting } from '../../types'

type T = Setting
export const SETTINGS_ENDPOINT = '/settings'
export const SETTINGS_PUSHER_EVENT = 'account_${account_id}_settings'
export class SettingsService extends Api<T> {
	constructor() {
		super(SETTINGS_ENDPOINT)
	}
	async getKey(key: string): Promise<T> {
		return await apiRequest<T>({
			url: `${SETTINGS_ENDPOINT}/${key}`,
			method: 'GET',
		})
	}
	async createKey(key: string, value: object): Promise<T> {
		return await apiRequest<T>({
			url: `${SETTINGS_ENDPOINT}`,
			method: 'POST',
			data: {
				value,
				key,
			},
		})
	}
	async updateKey(key: string, value: object): Promise<T> {
		return await apiRequest<T>({
			url: `${SETTINGS_ENDPOINT}`,
			method: 'PATCH',
			data: {
				value,
				key,
			},
		})
	}
}
