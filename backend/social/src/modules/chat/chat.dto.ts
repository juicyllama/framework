import { Account, BaseResponseDto, SwaggerPropertyDecorator, User } from '@juicyllama/core'
import { Classes } from '@juicyllama/utils'
import { IsNumber, IsDate, IsOptional, IsString } from 'class-validator'
import { ChatMessage } from './message/chat.message.entity'
import { Chat } from './chat.entity'

export class ChatDto {
	@IsOptional()
	account?: Account

	@IsOptional()
	@IsNumber()
	account_id?: number

	@IsOptional()
	users?: User[]

	@IsOptional()
	messages?: ChatMessage[]

	@IsDate()
	@IsOptional()
	last_message_at?: Date
}

export class ChatResponseDto extends Classes.ExtendsMultiple([ChatDto, BaseResponseDto]) {
	@SwaggerPropertyDecorator({ description: 'The chat ID', example: 1 })
	readonly chat_id!: number
}

export class ChatMessageDto {
	chat!: Chat

	@IsNumber()
	chat_id!: number

	user!: User

	@IsNumber()
	user_id!: number

	@IsString()
	message!: string
}

export class CreateChatMessageDto {
	@SwaggerPropertyDecorator({ description: 'The message you wish to post', example: 'Hello World!' })
	@IsString()
	message!: string
}

export class ChatMessageResponseDto extends Classes.ExtendsMultiple([ChatMessageDto, BaseResponseDto]) {
	@SwaggerPropertyDecorator({ description: 'The chat message ID', example: 1 })
	readonly chat_message_id!: number
}
