import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import {
	AccountModule,
	AuthModule,
	BeaconModule,
	Query,
} from '@juicyllama/core'
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

	],
	controllers: [ChatController],
	providers: [ChatService, ChatMessageService, ChatUsersService, Logger, Query], 
	exports: [ChatService],
})
export class ChatModule {}
