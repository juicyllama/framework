import { Body, Controller, forwardRef, Inject, Param, Req, Get, BadRequestException, Patch, Post } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import {
	Query as TQuery,
	AccountId,
	AuthService,
	ReadManyDecorator,
	ReadOneDecorator,
	UserAuth,
	BaseController,
	AuthenticatedRequest,
} from '@juicyllama/core'
import { CHAT_T as T, chatConstants as constants } from './chat.constants'
import { ChatService } from './chat.service'
import { ChatMessageService } from './message/chat.message.service'
import { ChatUsersService } from './users/chat.users.service'
import { In, IsNull, Not } from 'typeorm'
import { CreateChatMessageDto } from './chat.dto'
import { ChatMessage } from '../..'

@ApiTags('Chat')
@UserAuth()
@Controller('social/chat')
export class ChatController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => ChatService)) readonly chatService: ChatService,
		@Inject(forwardRef(() => ChatMessageService)) readonly chatMessageService: ChatMessageService,
		@Inject(forwardRef(() => ChatUsersService)) readonly chatUsersService: ChatUsersService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(chatService, tQuery, constants, {
			services: {
				authService,
			},
		})
	}

	@ApiOperation({ summary: 'Get Unread Chat Count' })
	@Get('/unread')
	async getUnreadChats(@Req() req: AuthenticatedRequest, @AccountId() account_id: number): Promise<any> {
		await this.authService.check(req.user.user_id, account_id)

		const chats = await this.chatService.findAll({
			where: {
				users: {
					user_id: req.user.user_id,
				},
				last_message_at: Not(IsNull()),
			},
		})

		const unread = await this.chatUsersService.findAll({
			where: {
				chat_id: In(chats.map(chat => chat.chat_id)),
				user_id: req.user.user_id,
			},
		})

		return unread.filter(
			chat =>
				chat.last_read_at === null ||
				chat.last_read_at === undefined ||
				(chat?.chat?.last_message_at !== undefined && chat.last_read_at < chat.chat.last_message_at),
		).length
	}

	@ReadOneDecorator(constants)
	@Get('/:chat_id')
	async getChat(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('chat_id') chat_id: number,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		const chat = await this.chatService.findById(chat_id)

		if (!chat) {
			throw new BadRequestException('Chat not found')
		}

		if (!chat.users?.includes(req.user) || (chat.account_id && chat.account_id !== account_id)) {
			throw new BadRequestException('Permission Denied', {
				cause: new Error(),
				description: 'You can only access your own chats',
			})
		}

		return chat
	}

	@ReadManyDecorator(constants)
	@Get()
	async getChats(@Req() req: AuthenticatedRequest, @AccountId() account_id: number): Promise<T[]> {
		await this.authService.check(req.user.user_id, account_id)

		return this.chatService.findAll({
			where: {
				users: In(req.user),
			},
		})
	}

	@ApiOperation({ summary: 'Mark Chat Read' })
	@Patch('/:chat_id/read')
	async markRead(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('chat_id') chat_id: number,
	): Promise<void> {
		await this.authService.check(req.user.user_id, account_id)

		const chat = await this.chatService.findById(chat_id)

		if (!chat) {
			throw new BadRequestException('Chat not found')
		}

		if (!chat.users?.includes(req.user) || (chat.account_id && chat.account_id !== account_id)) {
			throw new BadRequestException('Permission Denied', {
				cause: new Error(),
				description: 'You can only access your own chats',
			})
		}

		await this.chatService.markAsRead(chat_id, req.user.user_id)
	}

	@ApiOperation({ summary: 'Post Message' })
	@Post('/:chat_id/message')
	async postMessage(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('chat_id') chat_id: number,
		@Body() body: CreateChatMessageDto,
	): Promise<ChatMessage> {
		await this.authService.check(req.user.user_id, account_id)

		const chat = await this.chatService.findById(chat_id)

		if (!chat) {
			throw new BadRequestException('Chat not found')
		}

		if (!chat.users?.includes(req.user) || (chat.account_id && chat.account_id !== account_id)) {
			throw new BadRequestException('Permission Denied', {
				cause: new Error(),
				description: 'You can only access your own chats',
			})
		}

		return this.chatService.postMessage(chat.chat_id, req.user.user_id, body.message)
	}
}
