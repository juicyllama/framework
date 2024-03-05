import { BaseEntity } from '@juicyllama/core'
import { IsString, IsEnum, IsNumber } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Contact } from '../contacts.entity'
import { ContactEmailType } from './email.enums'

@Entity('crm_contacts_emails')
export class ContactEmail extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly email_id!: number

	@ManyToOne(() => Contact, contact => contact.contact_id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'contact_id' })
	contact?: Contact

	@Column()
	@IsNumber()
	contact_id!: number

	@Column({ default: null, nullable: true })
	@IsEnum(ContactEmailType)
	type?: ContactEmailType

	@Column()
	@IsString()
	email!: string

	constructor(partial: Partial<ContactEmail>) {
		super()
		Object.assign(this, partial)
	}
}
