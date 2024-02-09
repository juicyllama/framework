import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	ManyToMany,
	JoinTable,
	OneToMany,
} from 'typeorm'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { Account, BaseEntity, User } from '@juicyllama/core'
import { IsDate, IsNumber } from 'class-validator'
import { ChatMessage } from './message/chat.message.entity'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_chat')
export class Chat extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly chat_id!: number

	@ManyToOne(() => Account, (account: Account) => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column({ default: null, nullable: true })
	@IsNumber()
	account_id?: number

	@ManyToMany(() => User, (user: User) => user.user_id, { onDelete: 'CASCADE' })
	@JoinTable({
		name: 'social_chat_users',
		joinColumn: {
			name: 'chat_id',
			referencedColumnName: 'chat_id',
		},
		inverseJoinColumn: {
			name: 'user_id',
			referencedColumnName: 'user_id',
		},
	})
	users?: User[]

	@OneToMany(() => ChatMessage, (message: ChatMessage) => message.chat)
	messages?: ChatMessage[]

	@Column({ default: null, nullable: true })
	@IsDate()
	last_message_at?: Date

	constructor(partial: Partial<Chat>) {
		super()
		Object.assign(this, partial)
	}
}
