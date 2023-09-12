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
import { IsDate, IsString } from 'class-validator'
import { Account } from '@juicyllama/core'

@Entity('apps_xero_cc_contacts')
@Unique('apps_xero_cc_contacts_UNIQUE', ['account'])
export class XeroContact {
	@PrimaryGeneratedColumn()
	readonly xero_contact_id: number

	@Column()
	@IsString()
	ext_contact_id: string

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'account_id' })
	account: Account

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
