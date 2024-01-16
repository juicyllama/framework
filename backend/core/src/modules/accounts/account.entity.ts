import { IsArray, IsBoolean, IsEmail, IsEnum, IsNumber, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../../helpers/baseEntity'
import { SupportedCurrencies } from '@juicyllama/utils'
import { Tag } from '../tags/tags.entity'
import { Role } from '../auth/role.entity'
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
	@IsBoolean()
	onboarding_complete?: boolean

	@ManyToMany(() => Tag, tag => tag, { cascade: true })
	@JoinTable({
		name: 'account_tags',
		joinColumn: { name: 'account_id', referencedColumnName: 'account_id' },
		inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' },
	})
	@IsArray()
	tags?: Tag[]

	@OneToMany(() => Role, role => role.account, { cascade: true })
	roles?: Role[]

	constructor(partial: Partial<Account>) {
		super()
		Object.assign(this, partial)
	}
}
