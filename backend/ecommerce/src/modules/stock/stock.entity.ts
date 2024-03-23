import { BaseEntity } from '@juicyllama/core'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Sku } from '../product/skus/sku.entity'
import { IsNumber, IsString, IsDate } from 'class-validator'
import { StockLocation } from './locations/locations.entity'

@Entity('ecommerce_stock')
export class Stock extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly stock_id!: number

	@ManyToOne(() => Sku, sku => sku.sku_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'sku_id' })
	sku?: Sku

	@Column()
	@IsNumber()
	sku_id!: number

	@Column()
	@IsNumber()
	quantity!: number

	@Column({ default: null, nullable: true })
	@IsString()
	lot_number?: string

	@Column({ default: null, nullable: true })
	@IsDate()
	expires_at?: Date

	@ManyToOne(() => Sku, sku => sku.sku_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'stock_location_id' })
	stock_location?: StockLocation

	@Column({ default: null, nullable: true })
	@IsNumber()
	stock_location_id?: number


	constructor(partial: Partial<Stock>) {
		super()
		Object.assign(this, partial)
	}
}
