import { Account, BaseEntity } from '@juicyllama/core'
import { SupportedCurrencies } from '@juicyllama/utils'
import { Expose } from 'class-transformer'
import { IsArray, IsEnum, IsNumber, MaxLength, MinLength } from 'class-validator'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Invoice } from '../invoices/invoices.entity'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { PaymentMethodType } from '../payment_methods/payment.methods.enums'
import { PaymentType } from './payments.enums'

@Entity('billing_payments')
@Unique('billing_payments_UNIQUE', ['payment_method', 'app_payment_id'])
export class Payment extends BaseEntity {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly payment_id!: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	account_id!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	amount!: number

	@Column('varchar', { length: 3 })
	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	currency!: SupportedCurrencies

	@ManyToOne(() => PaymentMethod, payment_method => payment_method, { cascade: true })
	@JoinColumn({ name: 'payment_method_id' })
	payment_method?: PaymentMethod

	@Column()
	@IsNumber()
	payment_method_id!: number

	//The actual payment ID from the app
	@Column()
	@IsNumber()
	app_payment_id!: number

	@Column({ default: PaymentType.payment })
	@IsEnum(PaymentType)
	type?: PaymentType

	@Column({ default: PaymentMethodType.creditcard })
	@IsEnum(PaymentMethodType)
	method?: PaymentMethodType

	@Column('decimal', { precision: 20, scale: 10, default: 0.0 })
	@IsNumber()
	amount_allocated?: number

	@ManyToMany(() => Invoice, invoice => invoice, { cascade: true })
	@JoinTable({
		name: 'billing_payments_invoices',
		joinColumn: { name: 'payment_id', referencedColumnName: 'payment_id' },
		inverseJoinColumn: { name: 'invoice_id', referencedColumnName: 'invoice_id' },
	})
	@IsArray()
	invoices?: Invoice[]

	@Expose()
	get is_allocated(): boolean {
		return this.amount_allocated === this.amount
	}

	constructor(partial: Partial<Payment>) {
		super()
		Object.assign(this, partial)
	}
}
