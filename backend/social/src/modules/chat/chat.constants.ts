import { ControllerConstants } from '@juicyllama/core'
import { Chat } from './chat.entity'
import { ChatSelect, ChatOrderBy, ChatRelations } from './chat.enums'
import { ChatDto, ChatResponseDto } from './chat.dto'

export const CHAT_E = Chat
export type CHAT_T = Chat
export const CHAT_PRIMARY_KEY = 'chat_id'
export const CHAT_NAME = 'chat'
export const CHAT_SEARCH_FIELDS = []
export const CHAT_DEFAULT_ORDER_BY = 'last_message_at'
export const CHAT_WEBSOCKET_EVENT = 'user_${user_id}_social_chat' //all chats for user
export const CHAT_MESSAGE_WEBSOCKET_EVENT = 'user_${user_id}_social_chat_${chat_id}_messages' //all messages for chat

export const chatConstants: ControllerConstants = {
	entity: CHAT_E,
	name: CHAT_NAME,
	primaryKey: CHAT_PRIMARY_KEY,
	searchFields: CHAT_SEARCH_FIELDS,
	defaultOrderBy: CHAT_DEFAULT_ORDER_BY,
	selectEnum: ChatSelect,
	orderByEnum: ChatOrderBy,
	relationsEnum: ChatRelations,
	dtos: {
		base: ChatDto,
		response: ChatResponseDto,
	},
}
