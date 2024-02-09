import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { User } from '@juicyllama/core'
import { IsDate } from 'class-validator'
import { Chat } from '../chat.entity'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_chat_users')
export class ChatUsers {
	@PrimaryColumn({ name: 'chat_id' })
	chat_id!: number

	@ManyToOne(() => Chat)
	@JoinColumn({ name: 'chat_id' })
	chat?: Chat

	@PrimaryColumn({ name: 'user_id' })
	user_id!: number

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user?: User

	@Column({ default: null, nullable: true })
	@IsDate()
	last_read_at?: Date

	constructor(partial: Partial<ChatUsers>) {
		Object.assign(this, partial)
	}
}
