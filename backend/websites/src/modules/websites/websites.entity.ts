import { Account, BaseEntity } from '@juicyllama/core'
import { IsOptional, IsString, MaxLength, MinLength, IsUrl } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

@Entity('websites')
export class Website extends BaseEntity {
	@PrimaryGeneratedColumn()
	readonly website_id!: number

	@ManyToOne(() => Account, account => account.account_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'account_id' })
	account?: Account

	@Column()
	account_id!: number

	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@Column()
	name!: string

	@IsString()
	@IsUrl()
	@Column()
	url!: string

	@Column({ default: null, nullable: true })
	@IsString()
	@IsUrl()
	@IsOptional()
	screenshot_url?: string

	@Column({ default: null, nullable: true })
	@IsString()
	@IsUrl()
	@IsOptional()
	icon_url?: string

	constructor(partial: Partial<Website>) {
		super()
		Object.assign(this, partial)
	}
}
