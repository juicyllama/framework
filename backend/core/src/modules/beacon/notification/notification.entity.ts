import { IsNumber, IsDate, IsString, IsArray } from 'class-validator'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/users.entity.js'
import { Account } from '../../accounts/account.entity.js'
import { BaseEntity } from '../../../helpers/index.js'

@Entity('beacon_notification')
export class BeaconNotification extends BaseEntity {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly notification_id: number

	@ManyToOne(() => Account, account => account.account_id, { cascade: false })
	@JoinColumn({ name: 'account_id' })
	account: Account

	@ManyToMany(() => User, user => user.user_id)
	@JoinTable({
		name: 'beacon_notification_users',
		joinColumn: { name: 'notification_id', referencedColumnName: 'notification_id' },
		inverseJoinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
	})
	@IsArray()
	users?: User[]

	@Column()
	@IsString()
	subject: string

	@Column({ type: 'mediumtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', default: null, nullable: true }) //support emojis
	@IsString()
	markdown: string

	@Column({ default: null, nullable: true })
	@IsString()
	unique?: string

	@Column({ default: null, nullable: true })
	@IsDate()
	removed_at?: Date

	@ManyToOne(() => User, user => user.user_id, { cascade: false })
	@JoinColumn({ name: 'removed_by_id' })
	removed_by: User

	constructor(partial: Partial<BeaconNotification>) {
		super()
		Object.assign(this, partial)
	}
}
