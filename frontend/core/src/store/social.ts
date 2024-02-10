import { defineStore } from 'pinia'
import { Json } from '@juicyllama/vue-utils'
import { Chat } from '../types/social/chat'
import { socialChatService } from '../services/social/chat'

const localStore = 'social'

type CHAT_T = Chat
const CHAT_localStore = 'chats'

export const SocialStore = defineStore(localStore, {
	state: () => ({
		[CHAT_localStore]: Json.getLocalStorageObject<CHAT_T>(CHAT_localStore),
		unread_chats: Json.getLocalStorageObject<number>('unread_chats') ?? 0,
	}),
	actions: {
		async getUnreadChatsCount(): Promise<number> {		
		 	const result = await socialChatService.getUnreadChatsCount()
		 	window.localStorage.setItem('unread_chats', JSON.stringify(result))
		 	this.$state.unread_chats = result
		 	return result
		},
	},
	getters: {
		getChats(state): CHAT_T | null {
			return state[CHAT_localStore]
		},
	}
})