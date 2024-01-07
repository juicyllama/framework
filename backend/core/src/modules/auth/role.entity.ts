import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IsEnum } from 'class-validator'
import { BaseEntity } from '../../helpers/baseEntity.js'
import { Account } from '../accounts/account.entity.js'
import { User } from '../users/users.entity.js'
import { UserRole } from '../users/users.enums.js'
import { Unique } from 'typeorm'

@Entity('users_accounts_roles')
@Unique('users_accounts_roles_UNIQUE', ['user', 'account'])
export class Role extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint'})
	readonly role_id: number

	@ManyToOne(() => User, user => user.user_id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user?: User

	@Column({ type: 'bigint'})
	user_id: number

	@ManyToOne(() => Account, account => account.account_id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column({ type: 'bigint' })
	account_id: number

	@IsEnum(UserRole)
	@Column({ default: UserRole.MEMBER, type: 'varchar' })
	role: UserRole

	constructor(partial: Partial<User>) {
		super()
		Object.assign(this, partial)
	}
}
