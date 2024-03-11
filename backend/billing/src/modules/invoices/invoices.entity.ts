import { Account, AppIntegrationName, BaseEntity } from '@juicyllama/core'
import { SupportedCurrencies } from '@juicyllama/utils'
import { IsEnum, IsNumber, IsDate, IsArray, MinLength, MaxLength } from 'class-validator'
import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'
import { Charge } from '../charges/charges.entity'
import { Payment } from '../payments/payments.entity'

@Entity('billing_invoices')
export class Invoice extends BaseEntity {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly invoice_id!: number

	@ManyToOne(() => Account, a => a.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	@IsNumber()
	account_id!: number

	@Column({ type: 'enum', enum: AppIntegrationName, nullable: true, default: null })
	@IsEnum(AppIntegrationName)
	app_integration_name?: AppIntegrationName

	@Column({ default: null, nullable: true })
	@IsNumber()
	app_invoice_id?: number

	@Column({ type: 'enum', enum: SupportedCurrencies })
	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	currency!: SupportedCurrencies

	@Column('decimal', { precision: 20, scale: 10, default: 0 })
	@IsNumber()
	amount_subtotal?: number // amount before tax (used if tax > 0)

	@Column('decimal', { precision: 20, scale: 10, default: 0 })
	@IsNumber()
	amount_tax?: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	amount_total!: number // amount including tax

	@Column('decimal', { precision: 20, scale: 10, default: 0 })
	@IsNumber()
	amount_paid?: number

	@OneToMany(() => Charge, c => c.invoice)
	charges?: Charge[]

	@ManyToMany(() => Payment, payment => payment, { cascade: true })
	@JoinTable({
		name: 'billing_payments_invoices',
		joinColumn: { name: 'invoice_id', referencedColumnName: 'invoice_id' },
		inverseJoinColumn: { name: 'payment_id', referencedColumnName: 'payment_id' },
	})
	@IsArray()
	payments?: Payment[]

	@Column({ default: null, nullable: true })
	@IsDate()
	paid_at?: Date

	@Expose()
	get is_paid(): boolean {
		return this.amount_paid === this.amount_total
	}

	constructor(partial: Partial<Invoice>) {
		super()
		Object.assign(this, partial)
	}
}
