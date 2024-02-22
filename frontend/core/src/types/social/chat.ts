import { Account } from '../account'
import { User } from '../user'

export enum ChatMessageType {
	USER = 'USER',
	SYSTEM = 'SYSTEM',
}

export interface ChatMessage {
	chat_message_id: number
	chat_id: number
	chat: Chat
	user?: User
	user_id: number
	message: string
	type: ChatMessageType
	json?: any
	created_at: Date
	is_read?: boolean
}

export interface Chat {
	chat_id: number
	account?: Account
	account_id?: number
	users?: User[]
	messages?: ChatMessage[]
	last_message_at?: Date
	created_at: Date
}
