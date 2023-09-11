import { IsDate, IsJSON, IsString, MaxLength, MinLength } from 'class-validator'
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm'

@Entity('settings')
@Unique(['key'])
export class Setting {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	key: string

	@Column({ type: 'json', nullable: false })
	@IsJSON()
	value: any

	@CreateDateColumn()
	@IsDate()
	readonly created_at: Date

	@UpdateDateColumn()
	@IsDate()
	readonly updated_at: Date

	@DeleteDateColumn()
	@IsDate()
	readonly deleted_at: Date

	constructor(partial: Partial<Setting>) {
		Object.assign(this, partial)
	}
}
