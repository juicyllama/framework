import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService, Query, BaseService, UsersService, User } from '@juicyllama/core'
import { Strings } from '@juicyllama/utils'
import { Chat } from './chat.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository, In } from 'typeorm'
import { ChatMessage, ChatMessageService, ChatUsersService } from '../..'
import { CHAT_MESSAGE_WEBSOCKET_EVENT, CHAT_WEBSOCKET_EVENT } from './chat.constants'
import { ChatMessageType } from './message/chat.message.enums'
import { isEqual } from 'lodash'

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
		@Inject(forwardRef(() => UsersService)) readonly usersService: UsersService,
	) {
		super(query, repository)
	}

	async create(data: DeepPartial<Chat>): Promise<Chat> {
		if (!data.users?.length) throw new Error('Chat must have users')

		// get all chats involving the users
		const chats = await super.findAll({
			select: ['chat_id', 'users'],
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
			const chat_users = chat.users.map(user => user.user_id)

			if (isEqual(users.sort(), chat_users.sort())) {
				matched_chat = chat
				break
			}
		}

		if (matched_chat) return matched_chat

		const chat = await super.create(data)

		for (const user of chat.users) {
			await this.beaconService.sendPush(
				Strings.replacer(CHAT_WEBSOCKET_EVENT, {
					user_id: user.user_id,
					chat_id: chat.chat_id,
				}),
				{
					action: 'CREATE',
					data: chat,
				},
			)
		}

		return chat
	}

	async findByUserId(user_id: number): Promise<Chat> {
		const chat = await super.findOne({
			where: {
				users: {
					user_id,
				},
			},
			order: {
				last_message_at: 'DESC',
			},
		})
		return chat
	}

	async findAllByUserId(user_id: number): Promise<Chat[]> {
		const chats = await super.findAll({
			where: {
				users: {
					user_id,
				},
			},
			order: {
				last_message_at: 'DESC',
			},
		})
		return chats
	}

	async markAsRead(chat_id: number, user_id: number): Promise<void> {
		const chat = await super.findOne({
			where: {
				chat_id: chat_id,
				users: {
					user_id,
				},
			},
		})

		const repo = this.chatUsersService.repository

		if (!chat) {
			await repo.create({
				chat_id: chat_id,
				user_id: user_id,
				last_read_at: new Date(),
			})
		} else {
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

		await this.beaconService.sendPush(
			Strings.replacer(CHAT_WEBSOCKET_EVENT, {
				user_id: user_id,
				chat_id: chat_id,
			}),
			{
				action: 'UPDATE',
				data: chat,
			},
		)
	}

	async postMessage(chat_id: number, user_id: number, message: string, json?: any): Promise<ChatMessage> {
		const result = await this.chatMessageService.create({
			chat_id,
			user_id,
			message,
			json,
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

		result.user = this.cleanseUser(await this.usersService.findById(user_id))

		const chat = await this.findById(chat_id)
		await this.sendPush(chat, result)
		return result
	}

	async systemMessage(chat_id: number, message: string, json?: any): Promise<ChatMessage> {
		const chat = await this.findById(chat_id)

		if (!chat) throw new Error('Chat not found')

		const result = await this.chatMessageService.create({
			chat_id,
			message,
			type: ChatMessageType.SYSTEM,
			json,
		})

		await this.sendPush(chat, result)
		return result
	}

	async getChatsByParticipants(user_ids: number[]): Promise<Chat[] | undefined> {
		const chats = await super.findAll({
			where: {
				users: {
					user_id: In(user_ids),
				},
			},
		})

		// filter chats to find the chat with the only same users
		const matched_chats: Chat[] = []

		for (const chat of chats) {
			if (!chat.users) continue

			const chat_users = chat.users.map(user => user.user_id)

			if (isEqual(user_ids.sort(), chat_users.sort())) {
				matched_chats.push(chat)
			}
		}

		return matched_chats
	}

	async getUsers(chat_id: number): Promise<User[]> {
		const chat = await super.findById(chat_id)
		return chat.users
	}

	cleanse(chat: Chat): Chat {
		if (chat.users) {
			chat.users = <any>chat.users.map(user => this.cleanseUser(user))
		}

		if (chat.messages) {
			chat.messages = <any>chat.messages.map(message => {
				if (message.user) {
					message.user = this.cleanseUser(message.user)
				}
				return message
			})
		}

		return chat
	}

	cleanseUser(user: any): any {
		return {
			user_id: user.user_id,
			first_name: user.first_name,
			last_name: user.last_name ? user.last_name.substring(0, 1) : '',
			avatar_type: user.avatar_type,
			avatar_image_url: user.avatar_image_url,
		}
	}

	async sendPush(chat: Chat, result: ChatMessage): Promise<void> {
		for (const user of chat.users) {
			await this.beaconService.sendPush(
				Strings.replacer(CHAT_MESSAGE_WEBSOCKET_EVENT, {
					user_id: user.user_id,
					chat_id: chat.chat_id,
				}),
				{
					action: 'CREATE',
					data: result,
				},
			)
			await this.beaconService.sendPush(
				Strings.replacer(CHAT_WEBSOCKET_EVENT, {
					user_id: user.user_id,
					chat_id: chat.chat_id,
				}),
				{
					action: 'UPDATE',
					data: chat,
				},
			)
		}
	}
}
