import { IsEnum } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm'
import { BaseEntity } from '../../helpers/baseEntity'
import { Account } from '../accounts/account.entity'
import { User } from '../users/users.entity'
import { UserRole } from '../users/users.enums'

@Entity('users_accounts_roles')
@Unique('users_accounts_roles_UNIQUE', ['user', 'account'])
export class Role extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly role_id?: number

	@ManyToOne(() => User, user => user.user_id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user?: User

	@Column()
	user_id!: number

	@ManyToOne(() => Account, account => account.account_id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	account_id!: number

	@IsEnum(UserRole)
	@Column({ default: UserRole.MEMBER })
	role!: UserRole

	constructor(partial: Partial<User>) {
		super()
		Object.assign(this, partial)
	}
}
