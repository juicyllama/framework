import { Api } from '@/helpers/api.js'
import { Contact, FormApiOptionsCreate } from '@/types/index.js'
import instance from '../index.js'
import { accountStore } from '@/index.js'

type T = Contact
export const CONTACTS_ENDPOINT = '/crm/contacts'
export const CONTACTS_PUSHER_EVENT = `account_{account_id}_crm_contacts`
export class ContactsService extends Api<T> {
	override async create(options: FormApiOptionsCreate): Promise<T> {
		return await super.create(options)
	}

	async updateContactAvatar(contact_id: number, file: any): Promise<T> {
		instance.defaults.headers.common['account-id'] = accountStore.selected_account.account_id
		const url = `${CONTACTS_ENDPOINT}/${contact_id}/avatar`
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
