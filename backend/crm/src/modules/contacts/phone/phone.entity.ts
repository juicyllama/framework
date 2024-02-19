import { BaseEntity } from '@juicyllama/core'
import { IsString, IsEnum, MinLength, MaxLength, IsNumber } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Contact } from '../contacts.entity'
import { ContactPhoneStatus, ContactPhoneType } from './phone.enums'

@Entity('crm_contacts_phones')
export class ContactPhone extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly phone_id!: number

	@ManyToOne(() => Contact, contact => contact.contact_id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'contact_id' })
	contact?: Contact

	@Column()
	@IsNumber()
	contact_id!: number

	@Column({ default: null, nullable: true })
	@IsEnum(ContactPhoneType)
	type?: ContactPhoneType

	@Column()
	@IsString()
	@MinLength(2)
	@MaxLength(2)
	country_iso!: string

	@Column()
	@IsString()
	number!: string

	@Column({ default: null, nullable: true })
	@IsString()
	number_local_format?: string

	@Column({ default: ContactPhoneStatus.UNVERIFIED })
	@IsEnum(ContactPhoneStatus)
	status?: ContactPhoneStatus

	constructor(partial: Partial<ContactPhone>) {
		super()
		Object.assign(this, partial)
	}
}
