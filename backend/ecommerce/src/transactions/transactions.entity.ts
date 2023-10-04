import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
} from 'typeorm'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { Account, BaseEntity } from '@juicyllama/core'
import { IsNumber, IsString, IsEnum, MinLength, MaxLength, IsBoolean, IsDate } from 'class-validator'
import { Store } from '../stores/stores.entity'
import { TransactionDiscount } from './discounts/discounts.entity'
import { Contact } from '@juicyllama/crm'
import { TransactionFulfillmentStatus, TransactionPaymentStatus } from './transactions.enums'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('ecommerce_transactions')
export class Transaction extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly transaction_id: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	account_id: number

	@ManyToOne(() => Store, store => store.store_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'store_id' })
	store?: Store

	@Column()
	store_id?: number

	@Column()
	@IsString()
	order_id: string

	@Column({ nullable: true, default: null })
	@IsString()
	order_number?: string

	@ManyToOne(() => Contact, contact => contact.contact_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'shipping_contact_id' })
	shipping_contact?: Contact

	shipping_contact_id?: number

	@ManyToOne(() => Contact, contact => contact.contact_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'billing_contact_id' })
	billing_contact?: Contact

	billing_contact_id?: number

	@Column({ default: TransactionPaymentStatus.PENDING })
	@IsEnum(TransactionPaymentStatus)
	payment_status: TransactionPaymentStatus

	@Column({ default: TransactionFulfillmentStatus.PENDING })
	@IsEnum(TransactionFulfillmentStatus)
	fulfillment_status: TransactionFulfillmentStatus

	@Column()
	@IsString()
	@MinLength(3)
	@MaxLength(3)
	currency: string

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
	@IsNumber({ maxDecimalPlaces: 2 })
	subtotal_price: number

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
	@IsNumber({ maxDecimalPlaces: 2 })
	total_discounts?: number

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
	@IsNumber({ maxDecimalPlaces: 2 })
	total_tax: number

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
	@IsNumber({ maxDecimalPlaces: 2 })
	total_outstanding?: number

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
	@IsNumber({ maxDecimalPlaces: 2 })
	total_price: number	

	@OneToMany(() => TransactionDiscount, td => td.transaction)
	discounts?: TransactionDiscount[]

	@Column({ default: false })
	@IsBoolean()
	test?: boolean

	@Column({ nullable: true, default: null })
	@IsDate()
	cancelled_at?: Date

	@Column({ nullable: true, default: null })
	@IsString()
	cancel_reason?: string

	@Column({ nullable: true, default: null })
	@IsDate()
	refunded_at?: Date

	constructor(partial: Partial<Transaction>) {
		super()
		Object.assign(this, partial)
	}
}