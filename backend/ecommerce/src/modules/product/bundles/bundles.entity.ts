import { Account, BaseEntity } from '@juicyllama/core'
import { IsString, IsArray, IsNumber } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinColumn, Unique, JoinTable } from 'typeorm'
import { Sku } from '../skus/sku.entity'
import { App, InstalledApp } from '@juicyllama/app-store'

@Unique('ecommerce_bundles_UNIQUE', ['account_id', 'sku'])
@Entity('ecommerce_bundles')
export class Bundle extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly bundle_id!: number

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

	@ManyToMany(() => Sku, sku => sku, { cascade: true })
	@JoinTable({
		name: 'ecommerce_bundles_skus',
		joinColumn: { name: 'bundle_id', referencedColumnName: 'bundle_id' },
		inverseJoinColumn: { name: 'sku_id', referencedColumnName: 'sku_id' },
	})
	@IsArray()
	skus?: Sku[]

	constructor(partial: Partial<Bundle>) {
		super()
		Object.assign(this, partial)
	}
}
