import { Account, BaseEntity } from '@juicyllama/core'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity('tools_shortlinks')
@Unique('tools_shortlinks_UNIQUE', ['url_code'])
export class Shortlink extends BaseEntity {
	@PrimaryGeneratedColumn()
	shortlink_id!: number

	@IsString()
	@Column()
	url_code!: string

	@IsString()
	@Column()
	long_url!: string

	@IsString()
	@Column()
	short_url!: string

	@ManyToOne(() => Account, account => account.account_id, {
		cascade: true,
	})
	@JoinColumn({ name: 'account_id' })
	account!: Account

	@IsOptional()
	@IsString()
	@Column({ default: null, nullable: true })
	resource_type?: string

	@IsOptional()
	@IsNumber()
	@Column({ default: null, nullable: true })
	resource_id?: number

	constructor(partial: Partial<Shortlink>) {
		super()
		Object.assign(this, partial)
	}
}
