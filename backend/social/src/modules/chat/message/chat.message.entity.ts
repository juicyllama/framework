import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { BaseEntity, User } from '@juicyllama/core'
import { IsNumber, IsString } from 'class-validator'
import { Chat } from '../chat.entity'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_chat_message')
export class ChatMessage extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly chat_message_id!: number

	@Column()
	@IsNumber()
	chat_id!: number

	@ManyToOne(() => Chat, chat => chat.messages)
	chat!: Chat

	@ManyToOne(() => User, user => user.user_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user?: User

	@Column()
	@IsNumber()
	user_id!: number

	@Column('text')
	@IsString()
	message!: string

	constructor(partial: Partial<ChatMessage>) {
		super()
		Object.assign(this, partial)
	}
}
