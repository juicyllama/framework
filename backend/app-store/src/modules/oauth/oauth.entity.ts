import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { IsDateString, IsString, MaxLength } from 'class-validator'
import { InstalledApp } from '../installed/installed.entity'
import { BaseEntity } from '@juicyllama/core'

@Entity('apps_oauth')
export class Oauth extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly oauth_id!: number

	@ManyToOne(() => InstalledApp, installed_app => installed_app.installed_app_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'installed_app_id' })
	installed_app!: InstalledApp

	@Index('fk_b98a3c7ab28db3bede8c62f0cf1a0161')
	@Column()
	installed_app_id?: number

	@Column({ nullable: true, default: null })
	@IsString()
	access_token?: string

	@Column({ nullable: true, default: null })
	@IsString()
	refresh_token?: string

	@Column({ nullable: true, default: null })
	@IsString()
	token_type?: string

	@Column({ nullable: true, default: null })
	@IsString()
	state?: string

	@Column({ nullable: true, default: null })
	@IsString()
	scope?: string

	@Column('varchar', { length: 1000, nullable: true, default: null })
	@IsString()
	@MaxLength(1000)
	redirect_url?: string

	@Column({ default: null, nullable: true })
	@IsDateString()
	readonly expires_at?: Date

	constructor(partial: Partial<Oauth>) {
		super()
		Object.assign(this, partial)
	}
}
