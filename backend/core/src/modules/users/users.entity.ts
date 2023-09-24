import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
	MinLength,
} from 'class-validator'
import { BaseEntity } from '../../helpers/baseEntity.js'
import { Account } from '../accounts/account.entity.js'
import { UserAvatarType } from './users.enums.js'
import { Role } from '../auth/role.entity.js'

@Entity('users')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly user_id: number

	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@Column({ default: null, nullable: true })
	first_name?: string

	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@Column({ default: null, nullable: true })
	@Expose({ groups: ['ADMIN', 'OWNER'] })
	last_name?: string

	@Column({ unique: true })
	@IsEmail()
	@Expose({ groups: ['ADMIN', 'OWNER'] })
	readonly email: string

	@Column({ default: null, nullable: true })
	@IsString()
	@Exclude()
	password?: string

	@Column({ default: true })
	@IsBoolean()
	@Expose({ groups: ['ADMIN', 'OWNER'] })
	password_reset?: boolean

	@Column({ default: UserAvatarType.GRAVATAR })
	@IsEnum(UserAvatarType)
	avatar_type: UserAvatarType

	@Column({ default: null, nullable: true })
	@IsUrl()
	@IsOptional()
	avatar_image_url?: string

	@Column({ default: null, nullable: true })
	@IsDate()
	@Expose({ groups: ['ADMIN', 'OWNER'] })
	last_login_at?: Date

	//RELATIONS

	@ManyToMany(() => Account, account => account.account_id)
	@JoinTable({
		name: 'users_accounts',
		joinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
		inverseJoinColumn: { name: 'account_id', referencedColumnName: 'account_id' },
	})
	@IsArray()
	accounts?: Account[]

	@OneToMany(() => Role, role => role.user, { cascade: true })
	roles?: Role[]

	constructor(partial: Partial<User>) {
		super()
		Object.assign(this, partial)
	}
}
