import { BaseEntity } from '@juicyllama/core'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Transaction } from '../transactions.entity'
import { Sku } from '../../product/skus/sku.entity'
import { Bundle } from '../../product/bundles/bundles.entity'
import { IsNumber } from 'class-validator'

@Entity('ecommerce_transactions_items')
export class TransactionItem extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly transaction_item_id!: number

	@ManyToOne(() => Transaction, transaction => transaction.transaction_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'transaction_id' })
	transaction?: Transaction

	@Column()
	transaction_id!: number

	@ManyToOne(() => Sku, sku => sku.sku_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'sku_id' })
	sku?: Sku

	@Column({ nullable: true, default: null })
	sku_id?: number

	@ManyToOne(() => Bundle, bundle => bundle.bundle_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'bundle_id' })
	bundle?: Bundle

	@Column({ nullable: true, default: null })
	bundle_id?: number

	@Column()
	@IsNumber()
	quantity!: number

	constructor(partial: Partial<TransactionItem>) {
		super()
		Object.assign(this, partial)
	}
}
