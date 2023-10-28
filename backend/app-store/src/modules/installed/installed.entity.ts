import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'
import { IsBoolean, IsDate, IsEnum, IsObject, IsString } from 'class-validator'
import { App } from '../apps.entity'
import { AppIntegrationStatus, AppScope } from '../apps.enums'
import { Account, BaseEntity, User } from '@juicyllama/core'

@Entity('apps_installed')
export class InstalledApp extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly installed_app_id: number

	@ManyToOne(() => App, app => app.app_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'app_id' })
	app?: App

	@Index('fk_b88a70959c375ee29e8f7746c4c41211')
	@Column()
	app_id: number

	@Column()
	@IsString()
	name: string

	@IsEnum(AppScope)
	@Column({ default: AppScope.ACCOUNT })
	scope: AppScope

	@Column('json', { default: null, nullable: true })
	@IsObject()
	settings?: any

	@IsEnum(AppIntegrationStatus)
	@Column({ default: AppIntegrationStatus.DISCONNCTED })
	readonly integration_status?: AppIntegrationStatus

	// The URL to redirect to to start the OAUTH2 flow
	@Column({ nullable: true, default: null })
	@IsString()
	oauth_redirect_url?: string

	@Column({ default: true })
	@IsBoolean()
	readonly active: boolean

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	readonly account?: Account

	@Index('fk_9fbd2c599c2b40c0d3dea13f7f2df720')
	@Column({ default: null, nullable: true })
	readonly account_id?: number

	@ManyToOne(() => User, user => user.user_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	readonly user?: User

	@Index('fk_85d886d8f918264accb78a1d5ef4cedb')
	@Column({ default: null, nullable: true })
	readonly user_id?: number

	@Column({ default: null, nullable: true })
	@IsDate()
	last_check_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	next_check_at?: Date

	constructor(partial: Partial<InstalledApp>) {
		super()
		Object.assign(this, partial)
	}
}
