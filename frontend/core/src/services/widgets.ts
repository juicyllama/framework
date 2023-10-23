import instance from './index'
import type { Dashboard } from '../types/widget'
import { accountStore } from '../index'

export const DASHBOARD_ENDPOINT = '/dashboards'
export const USERS_PUSHER_CHANNEL = 'account_${account_id}_users'

const loadWidgets = async (): Promise<Dashboard> => {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
	return await instance.get(`${DASHBOARD_ENDPOINT}`)
}
const saveWidgets = async (data: object): Promise<Dashboard> => {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
	return await instance.post(`${DASHBOARD_ENDPOINT}`, {
		data,
	})
}

export { loadWidgets, saveWidgets }
