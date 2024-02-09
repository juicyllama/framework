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
