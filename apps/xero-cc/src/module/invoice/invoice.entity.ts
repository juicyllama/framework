import { BaseEntity } from '@juicyllama/core'
import { IsDate, IsNumber, IsString } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { XeroContact } from '../customer/contact.entity'

@Entity('apps_xero_cc_invoices')
@Unique('apps_xero_cc_invoices_UNIQUE', ['reference'])
export class XeroInvoice extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly xero_invoice_id!: number

	@Column()
	@IsString()
	ext_invoice_id!: string

	@Column()
	@IsString()
	reference!: string

	@Column('decimal', { precision: 20, scale: 10, default: 0 })
	@IsNumber()
	amount_due!: number

	@Column('decimal', { precision: 20, scale: 10, default: 0 })
	@IsNumber()
	amount_paid!: number

	@ManyToOne(() => XeroContact, contact => contact.xero_contact_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'xero_contact_id' })
	contact!: XeroContact

	@Column({ default: null, nullable: true })
	@IsDate()
	last_check_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	next_check_at?: Date
}
