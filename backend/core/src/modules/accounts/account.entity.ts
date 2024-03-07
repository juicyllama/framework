import { SupportedCurrencies } from '@juicyllama/utils'
import {
	IsArray,
	IsBoolean,
	IsEmail,
	IsEnum,
	IsNumber,
	IsString,
	IsUrl,
	MaxLength,
	MinLength,
	IsDate,
} from 'class-validator'
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, BeforeUpdate } from 'typeorm'
import { BaseEntity } from '../../helpers/baseEntity'
import { Tag } from '../tags/tags.entity'
import { User } from '../users/users.entity'
import { UserAccount } from '../auth/user-account.entity'

@Entity('accounts')
export class Account extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly account_id!: number

	@Column()
	@IsString()
	account_name!: string

	@Column({ type: 'varchar', default: SupportedCurrencies.USD })
	@IsEnum(SupportedCurrencies)
	currency!: SupportedCurrencies

	@Column({ default: null, nullable: true })
	@IsString()
	company_name?: string

	@Column({ default: null, nullable: true })
	@IsString()
	address_1?: string

	@Column({ default: null, nullable: true })
	@IsString()
	address_2?: string

	@Column({ default: null, nullable: true })
	@IsString()
	city?: string

	@Column({ default: null, nullable: true })
	@IsString()
	postcode?: string

	@Column({ default: null, nullable: true })
	@IsString()
	state?: string

	@Column({ default: null, nullable: true })
	@IsString()
	@MinLength(2)
	@MaxLength(2)
	country?: string

	@Column({ default: null, nullable: true })
	@IsEmail()
	finance_email?: string

	@Column({ default: null, nullable: true })
	@IsEmail()
	customer_service_email?: string

	@Column({ default: null, nullable: true })
	@IsUrl()
	avatar_image_url?: string

	@Column({ default: 0 })
	@IsNumber()
	onboarding_step?: number

	@Column({ default: null, nullable: true })
	@IsDate()
	onboarding_step_updated_at?: Date

	@Column({ default: null, nullable: true })
	@IsBoolean()
	onboarding_complete?: boolean

	@Column({ default: null, nullable: true })
	@IsDate()
	onboarding_complete_at?: Date

	@ManyToMany(() => Tag, tag => tag, { cascade: true })
	@JoinTable({
		name: 'account_tags',
		joinColumn: { name: 'account_id', referencedColumnName: 'account_id' },
		inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' },
	})
	@IsArray()
	tags?: Tag[]

	@ManyToMany(() => User, user => user.user_id)
	@JoinTable({
		name: 'users_accounts',
		joinColumn: { name: 'account_id', referencedColumnName: 'account_id' },
		inverseJoinColumn: { name: 'user_id', referencedColumnName: 'user_id' },
	})
	@IsArray()
	users!: User[]

	@OneToMany(() => UserAccount, userAccount => userAccount.account)
	@IsArray()
	user_accounts!: UserAccount[]

	@BeforeUpdate()
	async updateOnboardingDates(): Promise<void> {
		if (this.onboarding_step) this.onboarding_step_updated_at = new Date()
		if (this.onboarding_complete) this.onboarding_complete_at = new Date()
	}

	constructor(partial: Partial<Account>) {
		super()
		Object.assign(this, partial)
	}
}
