import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { IsDate, IsEnum, IsObject, IsString, IsNumber } from 'class-validator'
import { MollieCustomer } from '../customer/customer.entity'
import { MandateMethod, MandateStatus } from '@mollie/api-client'
import { MandateDetails } from '@mollie/api-client/dist/types/src/data/customers/mandates/data'
import { BaseEntity } from '@juicyllama/core'

@Entity('apps_mollie_mandates')
export class MollieMandate extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly mollie_mandate_id: number

	@Column()
	@IsString()
	ext_mandate_id: string

	@Column({ default: null, nullable: true })
	@IsEnum(MandateStatus)
	status?: MandateStatus

	@Column({ default: null, nullable: true })
	@IsEnum(MandateMethod)
	method?: MandateMethod

	@Column({ type: 'json', default: null, nullable: true })
	@IsObject()
	details?: MandateDetails

	@ManyToOne(() => MollieCustomer, customer => customer.mollie_customer_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'mollie_customer_id' })
	customer?: MollieCustomer

	@Column()
	@IsNumber()
	mollie_customer_id: number

	@Column({ default: null, nullable: true })
	@IsDate()
	last_check_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	next_check_at?: Date

	constructor(partial: Partial<MollieMandate>) {
		super()
		Object.assign(this, partial)
	}
}
