import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm'
import { IsDate, IsNumber, IsString } from 'class-validator'
import { XeroContact } from '../customer/contact.entity'

@Entity('apps_xero_cc_invoices')
@Unique('apps_xero_cc_invoices_UNIQUE', ['reference'])
export class XeroInvoice {
	@PrimaryGeneratedColumn()
	readonly xero_invoice_id: number

	@Column()
	@IsString()
	ext_invoice_id: string

	@Column()
	@IsString()
	reference: string

	@Column()
	@IsNumber()
	amount_due: number

	@Column()
	@IsNumber()
	amount_paid: number

	@ManyToOne(() => XeroContact, contact => contact.xero_contact_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'xero_contact_id' })
	contact: XeroContact

	@CreateDateColumn()
	@IsDate()
	readonly created_at: Date

	@UpdateDateColumn()
	@IsDate()
	readonly updated_at: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	last_check_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	next_check_at?: Date

	@DeleteDateColumn()
	deleted_at: Date

	constructor(partial: Partial<XeroContact>) {
		Object.assign(this, partial)
	}
}
