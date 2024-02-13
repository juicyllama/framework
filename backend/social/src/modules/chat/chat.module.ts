import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { AccountModule, AuthModule, BeaconModule, Query, UsersModule } from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chat } from './chat.entity'
import { ChatUsers } from './users/chat.users.entity'
import { ChatUsersService } from './users/chat.users.service'
import { ChatService } from './chat.service'
import { ChatMessage } from './message/chat.message.entity'
import { ChatMessageService } from './message/chat.message.service'
import { ChatController } from './chat.controller'

@Module({
	imports: [
		TypeOrmModule.forFeature([Chat, ChatMessage, ChatUsers]),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => UsersModule),
	],
	controllers: [ChatController],
	providers: [ChatService, ChatMessageService, ChatUsersService, Logger, Query],
	exports: [ChatService, ChatMessageService, ChatUsersService],
})
export class ChatModule {}
