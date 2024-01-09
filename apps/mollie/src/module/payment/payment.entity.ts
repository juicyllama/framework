import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { IsDate, IsEnum, IsNumber, IsString, MaxLength, IsOptional } from 'class-validator'
import { MollieCustomer } from '../customer/customer.entity'
import { MollieMandate } from '../mandate/mandate.entity'
import { SupportedCurrencies } from '@juicyllama/utils'
import { PaymentMethod, PaymentStatus } from '@mollie/api-client'
import { BaseEntity } from '@juicyllama/core'

@Entity('apps_mollie_payments')
export class MolliePayment extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly mollie_payment_id: number

	@Column({ default: null, nullable: true })
	@IsString()
	ext_payment_id?: string

	@Column()
	@IsEnum(PaymentStatus)
	status: PaymentStatus

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
	@IsNumber({ maxDecimalPlaces: 2 })
	amount: number

	@Column({ length: 3 })
	@IsEnum(SupportedCurrencies)
	@MaxLength(3)
	currency: SupportedCurrencies

	@Column()
	@IsEnum(PaymentMethod)
	method: PaymentMethod

	@ManyToOne(() => MollieCustomer, customer => customer.mollie_customer_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'mollie_customer_id' })
	customer?: MollieCustomer

	@Column()
	@IsNumber()
	mollie_customer_id: number

	@ManyToOne(() => MollieMandate, mandate => mandate.mollie_mandate_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'mollie_mandate_id' })
	mandate?: MollieMandate

	@Column({ default: null, nullable: true })
	@IsNumber()
	@IsOptional()
	mollie_mandate_id?: number

	@Column({ default: null, nullable: true })
	@IsDate()
	last_check_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	next_check_at?: Date

	constructor(partial: Partial<MolliePayment>) {
		super()
		Object.assign(this, partial)
	}
}
