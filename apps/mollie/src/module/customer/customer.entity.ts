import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { IsDate, IsString, IsNumber } from 'class-validator'
import { Account, BaseEntity } from '@juicyllama/core'

@Entity('apps_mollie_customers')
@Unique('apps_mollie_customers_UNIQUE', ['account'])
export class MollieCustomer extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly mollie_customer_id: number

	@Column()
	@IsString()
	ext_customer_id: string

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	@IsNumber()
	account_id: number

	@Column({ default: null, nullable: true })
	@IsDate()
	last_check_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	next_check_at?: Date

	constructor(partial: Partial<MollieCustomer>) {
		super()
		Object.assign(this, partial)
	}
}
