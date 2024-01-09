import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { IsEnum, IsObject, IsString } from 'class-validator'
import { InstalledApp } from '../installed/installed.entity'
import { AppsLogsType } from './logs.enums'
import { BaseEntity } from '@juicyllama/core'
@Entity('apps_logs')
export class Log extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly log_id: number

	@ManyToOne(() => InstalledApp, installed_app => installed_app.installed_app_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'installed_app_id' })
	installed_app: InstalledApp

	@Index('fk_e8c3b8c9310b161f8e023a5ef090e213')
	@Column()
	installed_app_id?: number

	@Column({ default: AppsLogsType.ERROR })
	@IsEnum(AppsLogsType)
	type?: AppsLogsType

	@Column({ default: null, nullable: true })
	@IsString()
	subject?: string

	@Column()
	@IsString()
	message: string

	@Column({ type: 'json', default: null, nullable: true })
	@IsObject()
	json?: any

	constructor(partial: Partial<Log>) {
		super()
		Object.assign(this, partial)
	}
}
