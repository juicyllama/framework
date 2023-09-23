import instance from './index.js'
import type { User } from '../types/user.js'
import type { UserRole } from '../types/role.js'
import { Api, apiRequest } from '@/helpers/api.js'
import { accountStore } from '../index.js'

type T = User
export const USERS_ENDPOINT = '/users'
export const USERS_PUSHER_CHANNEL = 'account_${account_id}_users'

export class UsersService extends Api<T> {
	async updateUserRole(user_id: number, role: UserRole): Promise<T> {
		return await apiRequest<T>({
			url: `${USERS_ENDPOINT}/${user_id}/role?role=${role}`,
			method: 'PATCH',
			data: {
				role: role,
			},
		})
	}

	async updateUserAvatar(user_id: number, file: any): Promise<T> {
		instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
		const url = `${USERS_ENDPOINT}/${user_id}/avatar`
		const formData = new FormData()
		formData.append('file', file)

		const response = await instance.patch(url, formData, {
			headers: {
				'content-type': 'multipart/form-data',
			},
		})

		return response.data
	}
}
