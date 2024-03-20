import { IsDate, IsEnum, IsNumber, IsObject, IsString } from 'class-validator'
import { BeaconStatus } from '../beacon.enums'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { AppIntegrationName } from '../../../types/apps.enums'

@Entity('beacon_push')
export class BeaconPush {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly push_id?: number

	@Column()
	@IsString()
	event!: string

	@Column({ type: 'json', default: null, nullable: true })
	@IsObject()
	data?: any

	@Column({ type: 'enum', enum: AppIntegrationName })
	@IsEnum(AppIntegrationName)
	app_integration_name?: AppIntegrationName

	@Column({ type: 'enum', enum: BeaconStatus, default: BeaconStatus.PENDING })
	@IsEnum(BeaconStatus)
	status?: BeaconStatus = BeaconStatus.PENDING

	@Column({ default: null, nullable: true })
	@IsString()
	unique?: string

	@CreateDateColumn()
	readonly created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	pushed_at?: Date

	constructor(partial: Partial<BeaconPush>) {
		Object.assign(this, partial)
	}
}
