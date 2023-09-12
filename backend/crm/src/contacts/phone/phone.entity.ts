import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IsString, IsEnum, MinLength, MaxLength } from 'class-validator'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { Contact } from '../contacts.entity'
import { ContactPhoneStatus, ContactPhoneType } from './phone.enums'
import { BaseEntity } from '@juicyllama/core'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('crm_contacts_phones')
export class ContactPhone extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly phone_id: number

	@ManyToOne(() => Contact, contact => contact.contact_id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'contact_id' })
	contact: Contact

	@Column({ default: null, nullable: true })
	@IsEnum(ContactPhoneType)
	type?: ContactPhoneType

	@Column()
	@IsString()
	@MinLength(2)
	@MaxLength(2)
	country_iso: string

	@Column()
	@IsString()
	number: string

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
