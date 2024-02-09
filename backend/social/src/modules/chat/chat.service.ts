import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Chat } from './chat.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository, In } from 'typeorm'
import { ChatMessage, ChatMessageService, ChatUsersService } from '../..'

const E = Chat
type T = Chat

@Injectable()
export class ChatService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => ChatMessageService)) readonly chatMessageService: ChatMessageService,
		@Inject(forwardRef(() => ChatUsersService)) readonly chatUsersService: ChatUsersService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async create(data: DeepPartial<Chat>): Promise<Chat> {
		if (!data.users?.length) throw new Error('Chat must have users')

		// get all chats involving the users
		const chats = await super.findAll({
			where: {
				users: {
					user_id: In(data.users.map(user => user.user_id)),
				},
			},
		})

		// filter chats to find the chat with the only same users
		let matched_chat: Chat | undefined
		for (const chat of chats) {
			if (!chat.users) continue

			const users = data.users.map(user => user.user_id)

			const matches = chat.users.map(user => users.includes(user.user_id as number))

			if (matches.every(Boolean)) {
				matched_chat = chat
				break
			}
		}

		if (matched_chat) return matched_chat

		return await super.create(data)
	}

	async markAsRead(chat_id: number, user_id: number): Promise<void> {
		await this.chatUsersService.update({
			chat_id: chat_id,
			user_id: user_id,
			last_read_at: new Date(),
		})
	}

	async postMessage(chat_id: number, user_id: number, message: string): Promise<ChatMessage> {
		const result = await this.chatMessageService.create({
			chat_id: chat_id,
			user_id: user_id,
			message: message,
		})

		if (result.chat_message_id) {
			await super.update({
				chat_id: chat_id,
				last_message_at: new Date(),
			})

			const repo = this.chatUsersService.repository
			await repo.update(
				{
					chat_id: chat_id,
					user_id: user_id,
				},
				{
					last_read_at: new Date(),
				},
			)
		}

		return result
	}
}
