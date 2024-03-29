import { BaseEntity } from '@juicyllama/core'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { IsString } from 'class-validator'
import { App, InstalledApp } from '@juicyllama/app-store'

@Entity('ecommerce_stock_locations')
export class StockLocation extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly stock_location_id!: number

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
	@IsString()
	ext_id?: string

	@Column()
	@IsString()
	name!: string

	@Column()
	@IsString()
	city!: string

	@Column({ default: null, nullable: true })
	@IsString()
	state?: string

	@Column()
	@IsString()
	country_code!: string

	constructor(partial: Partial<StockLocation>) {
		super()
		Object.assign(this, partial)
	}
}
