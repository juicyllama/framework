import { Account, BaseEntity } from '@juicyllama/core'
import { IsNumber, IsString, IsEnum } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Transaction } from '../transactions.entity'
import { TransactionDiscountType } from './discounts.enums'

@Entity('ecommerce_transactions_discounts')
export class TransactionDiscount extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly transaction_discount_id!: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	account_id!: number

	@ManyToOne(() => Transaction, transaction => transaction.transaction_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'transaction_id' })
	transaction?: Transaction

	@Column({ default: null, nullable: true })
	transaction_id?: number

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
	@IsNumber({ maxDecimalPlaces: 2 })
	amount!: number

	@Column()
	@IsString()
	code!: string

	@Column({ default: null, nullable: true })
	@IsEnum(TransactionDiscountType)
	type!: TransactionDiscountType

	constructor(partial: Partial<TransactionDiscount>) {
		super()
		Object.assign(this, partial)
	}
}
