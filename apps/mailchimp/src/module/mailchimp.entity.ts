import { IsDate, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity('crm_contacts_mailchimp')
export class MailchimpContact {
	@PrimaryGeneratedColumn()
	readonly id: number

	@Column()
	contact_id?: number

	@IsString()
	@Column()
	mailchimp_id: string

	@CreateDateColumn()
	@IsDate()
	readonly created_at: Date

	@UpdateDateColumn()
	@IsDate()
	updated_at: Date

	@DeleteDateColumn()
	@IsDate()
	deleted_at: Date

	constructor(partial: Partial<MailchimpContact>) {
		Object.assign(this, partial)
	}
}
