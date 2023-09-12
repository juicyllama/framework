import { IsDate, IsEnum, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '@juicyllama/core'
import { SupportedCurrencies } from '@juicyllama/utils'

@Entity('apps_wise_transactions')
export class WiseTransaction extends BaseEntity {
	@PrimaryGeneratedColumn()
	@IsNumber()
	readonly wise_transaction_id: number

	@Column({ default: null, nullable: true })
	@IsString()
	ext_payment_id?: string

	@Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
	@IsNumber({ maxDecimalPlaces: 2 })
	amount: number

	@Column({ length: 3 })
	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	currency: SupportedCurrencies

	@Column({ default: null, nullable: true })
	@IsString()
	reference?: string

	@Column({ default: null, nullable: true })
	@IsDate()
	last_check_at?: Date

	@Column({ default: null, nullable: true })
	@IsDate()
	next_check_at?: Date

	constructor(partial: Partial<WiseTransaction>) {
		super()
		Object.assign(this, partial)
	}
}
