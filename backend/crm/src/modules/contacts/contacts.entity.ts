import { Account, BaseEntity, Tag, User, UserAvatarType } from '@juicyllama/core'
import { Expose } from 'class-transformer'
import { IsArray, IsDate, IsOptional, IsString, MaxLength, MinLength, IsEnum } from 'class-validator'
import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from 'typeorm'
import { ContactAddress } from './address/address.entity'
import { ContactSubscriptionStatus } from './contacts.enums'
import { ContactEmail } from './email/email.entity'
import { ContactPhone } from './phone/phone.entity'
import { ContactSocial } from './social/social.entity'

@Entity('crm_contacts')
export class Contact extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly contact_id!: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	account_id!: number

	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@Column({ default: null, nullable: true })
	first_name?: string

	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@Column({ default: null, nullable: true })
	last_name?: string

	@OneToMany(() => ContactEmail, email => email.contact, { cascade: ['insert', 'update'] })
	emails?: ContactEmail[]

	@OneToMany(() => ContactPhone, phone => phone.contact, { cascade: ['insert', 'update'] })
	phones?: ContactPhone[]

	@OneToMany(() => ContactSocial, social => social.contact, { cascade: ['insert', 'update'] })
	socials?: ContactSocial[]

	@OneToMany(() => ContactAddress, address => address.contact, { cascade: ['insert', 'update'] })
	addresses?: ContactAddress[]

	@ManyToMany(() => Tag, tag => tag, { cascade: false })
	@JoinTable({
		name: 'crm_contacts_tags',
		joinColumn: { name: 'contact_id', referencedColumnName: 'contact_id' },
		inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' },
	})
	@IsArray()
	tags?: Tag[]

	@Column({ type: 'enum', enum: UserAvatarType, default: UserAvatarType.NONE })
	@IsEnum(UserAvatarType)
	avatar_type?: UserAvatarType

	@Column({ default: null, nullable: true })
	@IsString()
	@IsOptional()
	avatar_image_url?: string

	@Column({ nullable: true, default: null })
	@IsDate()
	dob?: Date

	@Column({ type: 'enum', enum: ContactSubscriptionStatus, default: ContactSubscriptionStatus.pending })
	@IsEnum(ContactSubscriptionStatus)
	subscribed_status?: ContactSubscriptionStatus

	@ManyToOne(() => User, user => user.user_id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'added_by_user_id' })
	added_by?: User

	@Expose()
	get name(): string {
		return `${this.first_name} ${this.last_name}`
	}

	@Expose()
	get tags_array(): string[] {
		return (this.tags || []).map(tag => tag.name)
	}

	constructor(partial: Partial<Contact>) {
		super()
		Object.assign(this, partial)
	}
}
