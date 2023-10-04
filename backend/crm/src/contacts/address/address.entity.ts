import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IsString, IsEnum, MinLength, MaxLength, IsNumber } from 'class-validator'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { Contact } from '../contacts.entity'
import { ContactAddressType } from './address.enums'
import { BaseEntity } from '@juicyllama/core'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('crm_contacts_addresses')
export class ContactAddress extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly address_id: number

	@ManyToOne(() => Contact, contact => contact.contact_id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'contact_id' })
	contact: Contact

	@Column({ default: null, nullable: true })
	@IsEnum(ContactAddressType)
	type?: ContactAddressType

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
	post_code?: string

	@Column({ default: null, nullable: true })
	@IsString()
	state?: string

	@Column({ default: null, nullable: true })
	@IsString()
	@MinLength(2)
	@MaxLength(2)
	country_iso?: string

	@Column({ type: 'decimal', precision: 10, scale: 6, default: null, nullable: true })
	@IsNumber()
	latitude?: number

	@Column({ type: 'decimal', precision: 10, scale: 6, default: null, nullable: true })
	@IsNumber()
	longitude?: number

	constructor(partial: Partial<ContactAddress>) {
		super()
		Object.assign(this, partial)
	}
}
