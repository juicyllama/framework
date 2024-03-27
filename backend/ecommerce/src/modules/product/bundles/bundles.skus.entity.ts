import { IsNumber } from 'class-validator'
import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Bundle } from './bundles.entity'
import { Sku } from '../skus/sku.entity'

@Entity('ecommerce_bundles_skus')
export class BundleSkus {
	@PrimaryColumn()
	bundle_id!: number

	@ManyToOne(() => Bundle, bundle => bundle.bundleSkus)
	@JoinColumn({ name: 'bundle_id' })
	bundle?: Bundle

	@PrimaryColumn()
	sku_id!: number

	@ManyToOne(() => Sku, sku => sku.skuBundles)
	@JoinColumn({ name: 'sku_id' })
	sku?: Sku

	@Column({ nullable: true, default: null })
	@IsNumber()
	quantity?: number

	constructor(partial: Partial<BundleSkus>) {
		Object.assign(this, partial)
	}
}
