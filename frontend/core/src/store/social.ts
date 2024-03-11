import { defineStore } from 'pinia'
import { Json } from '@juicyllama/utils'
import { Chat } from '../types/social/chat'
import { SOCIAL_CHAT_ENDPOINT, socialChatService } from '../services/social/chat'

const localStore = 'social'

type CHAT_T = Chat
const CHAT_localStore = 'chats'

export const SocialStore = defineStore(localStore, {
	state: () => ({
		[CHAT_localStore]: Json.getLocalStorageObject<CHAT_T[]>(CHAT_localStore),
		unread_chats: Json.getLocalStorageObject<number>('unread_chats') ?? 0,
	}),
	actions: {
		async getUnreadChatsCount(): Promise<number> {
			const result = await socialChatService.getUnreadChatsCount()
			window.localStorage.setItem('unread_chats', JSON.stringify(result))
			this.$state.unread_chats = result
			return result
		},
		async findAllChats(): Promise<CHAT_T[]> {
			const result = await socialChatService.listChats()
			window.localStorage.setItem(CHAT_localStore, JSON.stringify(result))
			this.$state[CHAT_localStore] = result
			return result
		},
		async findOneChat(chat_id: number): Promise<CHAT_T> {
			const result = await socialChatService.findOne({
				url: SOCIAL_CHAT_ENDPOINT,
				record_id: chat_id,
			})

			const chats = this.$state[CHAT_localStore]
			const index = chats.findIndex(chat => chat.chat_id === chat_id)
			if (index !== -1) {
				chats[index] = result
			}
			window.localStorage.setItem(CHAT_localStore, JSON.stringify(chats))
			this.$state[CHAT_localStore] = chats
			return result
		},
		async markChatRead(chat_id: number): Promise<void> {
			await socialChatService.markChatAsRead(chat_id)
		},
		async postMessage(chat_id: number, message: string): Promise<CHAT_T> {
			const result = await socialChatService.post({
				url: SOCIAL_CHAT_ENDPOINT + `/${chat_id}/message`,
				data: {
					message,
				},
			})
			if (result && result.chat_id) {
				const chats = this.$state[CHAT_localStore]
				const index = chats.findIndex(chat => chat.chat_id === chat_id)
				if (index !== -1) {
					chats[index].messages.push(result)
				}
				window.localStorage.setItem(CHAT_localStore, JSON.stringify(chats))
				this.$state[CHAT_localStore] = chats
				return chats[index]
			}
		},
	},
	getters: {
		getChats(state): CHAT_T[] | null {
			return state[CHAT_localStore]
		},
		getUnreadChats(state): number {
			return state.unread_chats
		},
	},
})
