import { InstalledApp } from '@juicyllama/app-store'
import { Account, BaseEntity } from '@juicyllama/core'
import { Website } from '@juicyllama/websites'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

@Entity('ecommerce_stores')
export class Store extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly store_id!: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	account_id!: number

	@ManyToOne(() => Website, website => website.website_id, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'website_id' })
	website?: Website

	@Column({ default: null, nullable: true })
	website_id?: number

	@ManyToOne(() => InstalledApp, installed_app => installed_app.installed_app_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'installed_app_id' })
	installed_app?: InstalledApp

	@Column({ default: null, nullable: true })
	installed_app_id?: number

	constructor(partial: Partial<Store>) {
		super()
		Object.assign(this, partial)
	}
}
