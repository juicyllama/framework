import { Account } from "../account"
import { User } from "../user"

export interface ChatMessage {
	chat_message_id: number
	chat_id: number
	chat: Chat
	user?: User
	user_id: number
	message: string
}

export interface Chat {
	chat_id: number
	account?: Account
	account_id?: number
	users?: User[]
	messages?: ChatMessage[]
	last_message_at?: Date
}


