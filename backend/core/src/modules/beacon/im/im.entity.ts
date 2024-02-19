import { IsEnum, IsNumber, IsDate, IsString, IsObject } from 'class-validator'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { BeaconCommunicationDto } from '../beacon.dto'
import { BeaconStatus } from '../beacon.enums'

@Entity('beacon_im')
export class BeaconIm {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly im_id!: number

	@Column({ type: 'json', default: null, nullable: true })
	@IsObject()
	communication!: BeaconCommunicationDto

	@Column({ default: null, nullable: true })
	@IsString()
	app_integration_name?: string

	@Column({ default: null, nullable: true })
	@IsNumber()
	app_im_id?: number

	@Column({ type: 'mediumtext', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', default: null, nullable: true }) //support emojis
	@IsString()
	markdown!: string

	@Column({ default: BeaconStatus.PENDING })
	@IsEnum(BeaconStatus)
	status?: BeaconStatus

	@Column({ default: null, nullable: true })
	@IsString()
	unique?: string

	@CreateDateColumn()
	readonly created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	sent_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	delivered_at?: Date

	constructor(partial: Partial<BeaconIm>) {
		Object.assign(this, partial)
	}
}
