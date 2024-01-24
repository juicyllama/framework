import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { IsString, IsOptional, IsArray } from 'class-validator'
import { BaseEntity } from '@juicyllama/core'
import { Shortlink } from '../shortlinks.entity'

@Entity('tools_shortlinks_clicks')
export class ShortlinkClick extends BaseEntity {
	@PrimaryGeneratedColumn()
	shortlink_click_id!: number

	@ManyToOne(() => Shortlink, sl => sl.shortlink_id, {
		cascade: true,
	})
	@JoinColumn({ name: 'shortlink_id' })
	shortlink!: Shortlink

	@IsOptional()
	@IsString()
	@Column({ default: null, nullable: true })
	browser?: string

	@IsOptional()
	@IsString()
	@Column({ default: null, nullable: true })
	version?: string

	@IsOptional()
	@IsString()
	@Column({ default: null, nullable: true })
	os?: string

	@IsOptional()
	@IsString()
	@Column({ default: null, nullable: true })
	platform?: string

	@IsOptional()
	@IsString()
	@Column({ default: null, nullable: true })
	ip?: string

	@IsOptional()
	@IsString()
	@Column({ default: null, nullable: true })
	source?: string

	@IsOptional()
	@IsArray()
	@Column({ type: 'json', default: null, nullable: true })
	is?: string[]

	constructor(partial: Partial<ShortlinkClick>) {
		super()
		Object.assign(this, partial)
	}
}
