import instance from './index'
import type { Dashboard } from '../types/widget'
import { accountStore } from '../index'

const loadWidgets = async (endpoint: string): Promise<Dashboard> => {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
	return await instance.get(endpoint)
}
const saveWidgets = async (endpoint: string, data: object): Promise<Dashboard> => {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
	return await instance.post(endpoint, {
		data,
	})
}

export { loadWidgets, saveWidgets }
