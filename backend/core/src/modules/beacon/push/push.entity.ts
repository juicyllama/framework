import { IsEnum, IsNumber, IsDate, IsString, IsObject } from 'class-validator'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { BeaconStatus } from '../beacon.enums.js'

@Entity('beacon_push')
export class BeaconPush {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly push_id: number

	@Column()
	@IsString()
	event: string

	@Column({ type: 'json', default: null, nullable: true })
	@IsObject()
	data?: any

	@Column({ default: null, nullable: true })
	@IsString()
	app_integration_name?: string

	@Column({ default: BeaconStatus.PENDING })
	@IsEnum(BeaconStatus)
	status: BeaconStatus

	@Column({ default: null, nullable: true })
	@IsString()
	unique?: string

	@CreateDateColumn()
	readonly created_at: Date

	@UpdateDateColumn()
	updated_at: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	pushed_at?: Date

	constructor(partial: Partial<BeaconPush>) {
		Object.assign(this, partial)
	}
}
