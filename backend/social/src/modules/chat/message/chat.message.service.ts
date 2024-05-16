import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatMessage } from './chat.message.entity'
import { ChatUsersService } from '../users/chat.users.service'
import { ChatService } from '../chat.service'
import { Logger } from '@juicyllama/utils'

const E = ChatMessage
type T = ChatMessage

@Injectable()
export class ChatMessageService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => ChatUsersService)) readonly chatUsersService: ChatUsersService,
		@Inject(forwardRef(() => ChatService)) readonly chatService: ChatService,
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async markReadMessages(
		messages: ChatMessage[] | undefined,
		chat_id: number,
		user_id: number,
	): Promise<ChatMessage[]> {
		if (!messages || !messages.length) return []

		const user = await this.chatUsersService.findOne({
			where: {
				chat_id: chat_id,
				user_id: user_id,
			},
		})

		if (!user) return []

		messages.forEach(message => {
			message.is_read = user.last_read_at && message.created_at ? message.created_at < user.last_read_at : false
		})

		return messages
	}
}
