import { Account, BaseEntity } from '@juicyllama/core'
import { IsNumber, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm'
import { App, InstalledApp } from '@juicyllama/app-store'

@Unique('ecommerce_skus_UNIQUE', ['account_id', 'sku'])
@Entity('ecommerce_skus')
export class Sku extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly sku_id!: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	account_id!: number

	@Column()
	@IsString()
	sku!: string

	@Column()
	@IsString()
	name!: string

	@Column({ nullable: true, default: null })
	@IsString()
	description?: string

	@ManyToOne(() => App, app => app.app_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'app_id' })
	app?: App

	@Column({ default: null, nullable: true })
	app_id?: number

	@ManyToOne(() => InstalledApp, installed_app => installed_app.installed_app_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'installed_app_id' })
	installed_app?: InstalledApp

	@Column({ default: null, nullable: true })
	installed_app_id?: number

	@Column({ default: null, nullable: true })
	@IsNumber()
	ext_id?: string

	@Column({ nullable: true, default: null })
	@IsString()
	category?: string

	@Column({ nullable: true, default: null })
	@IsString()
	image_url?: string

	@Column({ nullable: true, default: null })
	@IsString()
	barcode?: string

	@Column('decimal', { precision: 5, scale: 2, nullable: true, default: null })
	@IsNumber()
	weight_lbs?: number

	@Column('decimal', { precision: 5, scale: 2, nullable: true, default: null })
	@IsNumber()
	weight_oz?: number

	@Column('decimal', { precision: 5, scale: 2, nullable: true, default: null })
	@IsNumber()
	dimensions_length?: number

	@Column('decimal', { precision: 5, scale: 2, nullable: true, default: null })
	@IsNumber()
	dimensions_width?: number

	@Column('decimal', { precision: 5, scale: 2, nullable: true, default: null })
	@IsNumber()
	dimensions_height?: number

	@Column({ nullable: true, default: null })
	@IsString()
	customs_tariff_code?: string

	@Column('decimal', { precision: 5, scale: 2, nullable: true, default: null })
	@IsNumber()
	customs_value?: number

	@Column({ nullable: true, default: null })
	@IsString()
	customs_description?: string

	constructor(partial: Partial<Sku>) {
		super()
		Object.assign(this, partial)
	}
}
