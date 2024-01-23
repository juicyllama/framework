import { Account, BaseEntity } from '@juicyllama/core'
import { IsDate, IsString } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('apps_xero_cc_contacts')
@Unique('apps_xero_cc_contacts_UNIQUE', ['account'])
export class XeroContact extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly xero_contact_id!: number

	@Column()
	@IsString()
	ext_contact_id!: string

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'account_id' })
	account!: Account

	@Column({ default: null, nullable: true })
	@IsDate()
	last_check_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	next_check_at?: Date
}
