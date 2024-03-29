import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { BaseEntity, User } from '@juicyllama/core'
import { IsNumber, IsString, IsBoolean, IsEnum, IsObject } from 'class-validator'
import { Chat } from '../chat.entity'
import { ChatMessageType } from './chat.message.enums'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_chat_message')
export class ChatMessage extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly chat_message_id!: number

	@Column()
	@IsNumber()
	chat_id!: number

	@ManyToOne(() => Chat, chat => chat.messages)
	@JoinColumn({ name: 'chat_id' })
	chat!: Chat

	@ManyToOne(() => User, user => user.user_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user?: User

	@Column({ nullable: true, default: null })
	@IsNumber()
	user_id?: number

	@Column('text')
	@IsString()
	message!: string

	@Column({ type: 'enum', enum: ChatMessageType, default: ChatMessageType.USER })
	@IsEnum(ChatMessageType)
	type?: ChatMessageType

	@Column({ type: 'json', default: null, nullable: true })
	@IsObject()
	json?: any

	//built in runtime

	@IsBoolean()
	is_read?: boolean = false

	constructor(partial: Partial<ChatMessage>) {
		super()
		Object.assign(this, partial)
	}
}
