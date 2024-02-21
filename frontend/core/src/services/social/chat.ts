import { accountStore } from 'src'
import instance from '..'
import { Api } from '../../helpers'
import { Chat } from '../../types/social/chat'

type SOCIAL_CHAT_T = Chat
export const SOCIAL_CHAT_ENDPOINT = '/social/chat'
export const SOCIAL_CHAT_EVENT = 'account_${account_id}_social_chat'

export class SocialChatService extends Api<any> {
    constructor() {
		super(SOCIAL_CHAT_ENDPOINT)
	  }

	async getUnreadChatsCount(): Promise<number> {
		instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
		return await super.get({
			url: `${SOCIAL_CHAT_ENDPOINT}/unread`
		}) as any
	}

	async listChats(): Promise<SOCIAL_CHAT_T[]> {
		instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
		return await super.get({
			url: SOCIAL_CHAT_ENDPOINT
		})
	}

	async markChatAsRead(chat_id: number): Promise<void> {
		instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
		await super.patch({
			url: `${SOCIAL_CHAT_ENDPOINT}/${chat_id}/read`,
			data: {}
		})
	}

}

export const socialChatService = new SocialChatService()