import instance from './index'
import type { Account, CreateAccount, NewAccountDetails } from '../types/account'
import { DeepPartial } from 'quasar'
import { accountStore } from '../index'

export const createAccount = async (payload: CreateAccount): Promise<NewAccountDetails> => {
	const response = await instance.post(`/account`, {
		account_name: payload.account_name,
		owners_email: payload.email,
		owners_password: payload.password.value,
		owners_first_name: payload.first_name,
		owners_last_name: payload.last_name,
	})
	return response.data
}

export const createAdditionalAccount = async (account_name: string): Promise<NewAccountDetails> => {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
	const response = await instance.post(`/account/additional`, {
		account_name: account_name,
	})
	return response.data
}

export const getAccount = async (account_id: number): Promise<Account> => {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
	const response = await instance.get(`/account/${account_id}`)
	return response.data
}

export const updateAccount = async (account_id: number, payload: DeepPartial<Account>): Promise<Account> => {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
	const response = await instance.patch(`/account/${account_id}`, payload)
	return response.data
}

export async function updateAccountAvatar(account_id: number, file: any): Promise<Account> {
	instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
	const url = `account/avatar`
	const formData = new FormData()
	formData.append('file', file)

	const response = await instance.patch(url, formData, {
		headers: {
			'content-type': 'multipart/form-data',
		},
	})

	return response.data
}
