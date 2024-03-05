import { BaseEntity } from '@juicyllama/core'
import { IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('crm_contacts_mailchimp')
export class MailchimpContact extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly id!: number

	@Column()
	contact_id?: number

	@IsString()
	@Column()
	mailchimp_id!: string
}
