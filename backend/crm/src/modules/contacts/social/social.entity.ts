import { BaseEntity } from '@juicyllama/core'
import { IsString, IsEnum, IsNumber } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Contact } from '../contacts.entity'
import { ContactSocialType } from './social.enums'

@Entity('crm_contacts_socials')
export class ContactSocial extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly social_id!: number

	@ManyToOne(() => Contact, contact => contact, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'contact_id' })
	contact?: Contact

	@Column()
	@IsNumber()
	contact_id!: number

	@Column({ default: null, nullable: true })
	@IsEnum(ContactSocialType)
	type?: ContactSocialType

	@Column()
	@IsString()
	handle!: string

	constructor(partial: Partial<ContactSocial>) {
		super()
		Object.assign(this, partial)
	}
}
