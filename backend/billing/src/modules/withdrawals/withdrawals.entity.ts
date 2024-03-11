import { Account, BaseEntity } from '@juicyllama/core'
import { SupportedCurrencies } from '@juicyllama/utils'
import { IsEnum, IsNumber, MaxLength, MinLength } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { Wallet } from '../wallet/wallet.entity'
import { WithdrawalStatus } from './withdrawals.enums'

@Entity('billing_withdrawal')
export class Withdrawal extends BaseEntity {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly withdrawal_id!: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	readonly account?: Account

	@Column()
	@IsNumber()
	account_id!: number

	@Column('decimal', { precision: 20, scale: 10, default: null, nullable: true })
	@IsNumber()
	amount!: number

	@Column({ type: 'enum', enum: SupportedCurrencies })
	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	currency!: SupportedCurrencies

	@ManyToOne(() => PaymentMethod, payment_method => payment_method.payment_method_id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'payment_method_id' })
	readonly payment_method!: PaymentMethod

	@Column({ type: 'enum', enum: WithdrawalStatus, default: WithdrawalStatus.PENDING })
	@IsEnum(WithdrawalStatus)
	status?: WithdrawalStatus

	constructor(partial: Partial<Wallet>) {
		super()
		Object.assign(this, partial)
	}
}
