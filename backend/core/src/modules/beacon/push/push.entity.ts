import { IsEnum, IsNumber, IsDate, IsString, IsObject } from 'class-validator'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { BeaconStatus } from '../beacon.enums.js'

@Entity('beacon_push')
export class BeaconPush {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	@IsNumber()
	readonly push_id: number

	@Column({ type: 'varchar' })
	@IsString()
	event: string

	@Column({ type: 'json', default: null, nullable: true })
	@IsObject()
	data?: any

	@Column({ default: null, nullable: true, type: 'varchar' })
	@IsString()
	app_integration_name?: string

	@Column({ default: BeaconStatus.PENDING, type: 'varchar' })
	@IsEnum(BeaconStatus)
	status: BeaconStatus

	@Column({ default: null, nullable: true, type: 'varchar' })
	@IsString()
	unique?: string

	@CreateDateColumn({ type: 'timestamp'})
	readonly created_at: Date

	@UpdateDateColumn({ type: 'timestamp'})
	updated_at: Date

	@Column({ default: null, nullable: true, type: 'timestamp' })
	@IsDate()
	pushed_at?: Date

	constructor(partial: Partial<BeaconPush>) {
		Object.assign(this, partial)
	}
}
