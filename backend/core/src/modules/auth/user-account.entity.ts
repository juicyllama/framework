import { IsEnum } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { UserRole } from '../users/users.enums'
import { Account } from '../accounts/account.entity'
import { User } from '../users/users.entity'
import { BaseEntity } from '../../helpers/baseEntity'

@Entity('users_accounts')
export class UserAccount extends BaseEntity {
	@PrimaryColumn({ name: 'user_id' })
	user_id!: number

	@PrimaryColumn({ name: 'account_id' })
	account_id!: number

	@IsEnum(UserRole)
	@Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
	role!: UserRole

	@ManyToOne(() => User, user => user.accounts, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		createForeignKeyConstraints: false, // This is a workaround for a bug in TypeORM that causes the tests to fail because the table cannot be dropped
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
	user!: User

	@ManyToOne(() => Account, account => account.users, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		createForeignKeyConstraints: false, // This is a workaround for a bug in TypeORM that causes the tests to fail because the table cannot be dropped
	})
	@JoinColumn([{ name: 'account_id', referencedColumnName: 'account_id' }])
	account!: Account
}
