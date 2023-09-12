import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IsString, IsEnum } from 'class-validator'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { Contact } from '../contacts.entity'
import { ContactEmailType } from './email.enums'
import { BaseEntity } from '@juicyllama/core'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('crm_contacts_emails')
export class ContactEmail extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly email_id: number

	@ManyToOne(() => Contact, contact => contact.contact_id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'contact_id' })
	contact: Contact

	@Column({ default: null, nullable: true })
	@IsEnum(ContactEmailType)
	type?: ContactEmailType

	@Column()
	@IsString()
	email: string

	constructor(partial: Partial<ContactEmail>) {
		super()
		Object.assign(this, partial)
	}
}
