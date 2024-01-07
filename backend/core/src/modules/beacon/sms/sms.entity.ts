import { IsEnum, IsNumber, IsDate, IsString, IsObject } from 'class-validator'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { BeaconStatus } from '../beacon.enums.js'
import { BeaconCommunicationDto } from '../beacon.dto.js'

@Entity('beacon_sms')
export class BeaconSms {
	@PrimaryGeneratedColumn({ type: 'bigint'})
	@IsNumber()
	readonly sms_id: number

	@Column({ type: 'json', default: null, nullable: true })
	@IsObject()
	communication: BeaconCommunicationDto

	@Column({ default: null, nullable: true, type: 'varchar' })
	@IsString()
	app_integration_name?: string

	@Column({ default: null, nullable: true, type: 'bigint' })
	@IsNumber()
	app_sms_id?: number

	@Column({ type: 'mediumtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', default: null, nullable: true }) //support emojis
	@IsString()
	markdown: string

	@Column({ default: BeaconStatus.PENDING, type: 'varchar' })
	@IsEnum(BeaconStatus)
	status?: BeaconStatus

	@Column({ default: null, nullable: true, type: 'varchar' })
	@IsString()
	unique?: string

	@CreateDateColumn({ type: 'timestamp'})
	readonly created_at: Date

	@UpdateDateColumn({ type: 'timestamp'})
	updated_at: Date

	@Column({ default: null, nullable: true, type: 'timestamp' })
	@IsDate()
	sent_at?: Date

	@Column({ default: null, nullable: true, type: 'timestamp' })
	@IsDate()
	delivered_at?: Date

	constructor(partial: Partial<BeaconSms>) {
		Object.assign(this, partial)
	}
}
