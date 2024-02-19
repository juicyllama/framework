import { Account, BaseEntity } from '@juicyllama/core'
import { SupportedCurrencies } from '@juicyllama/utils'
import { IsEnum, IsNumber, MaxLength, MinLength } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Charge } from '../charges/charges.entity'
import { Payment } from '../payments/payments.entity'

@Entity('billing_wallet')
export class Wallet extends BaseEntity {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly wallet_id!: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	readonly account?: Account

	@Column()
	readonly account_id!: number

	@Column('decimal', { precision: 20, scale: 10, default: null, nullable: true })
	@IsNumber()
	debit_balance?: number

	@Column('decimal', { precision: 20, scale: 10, default: null, nullable: true })
	@IsNumber()
	credit_balance?: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	balance!: number

	@Column('varchar', { length: 3 })
	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	currency!: SupportedCurrencies

	@ManyToOne(() => Charge, charge => charge.charge_id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'charge_id' })
	readonly charge?: Charge

	@ManyToOne(() => Payment, payment => payment.payment_id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'payment_id' })
	readonly payment?: Payment

	constructor(partial: Partial<Wallet>) {
		super()
		Object.assign(this, partial)
	}
}
