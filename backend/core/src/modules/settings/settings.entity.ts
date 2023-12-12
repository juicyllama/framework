import { IsOptional, IsNumber, IsJSON, IsString, MaxLength, MinLength } from 'class-validator'
import { Column, ManyToOne, Entity, PrimaryGeneratedColumn, Unique, JoinColumn } from 'typeorm'
import { BaseEntity } from '../../helpers'
import { Account } from '../accounts/account.entity'
import { User } from '../users/users.entity'

@Entity('settings')
@Unique(['key'])
export class Setting extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	key: string

	@Column({ type: 'json', nullable: false })
	@IsJSON()
	value: any

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column({ default: null, nullable: true })
	@IsNumber()
	@IsOptional()
	account_id?: number

	@ManyToOne(() => User, user => user.user_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user?: User

	@Column({ default: null, nullable: true })
	@IsNumber()
	@IsOptional()
	user_id?: number

	constructor(partial: Partial<Setting>) {
		super()
		Object.assign(this, partial)
	}
}
