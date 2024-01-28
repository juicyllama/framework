import { BaseEntity } from '@juicyllama/core'
import { Dates } from '@juicyllama/utils'
import { IsNumber, IsDateString } from 'class-validator'
import { Entity, ObjectId, ObjectIdColumn, Column, Unique } from 'typeorm'

@Entity()
@Unique('fx_UNIQUE', ['date'])
export class Fx extends BaseEntity {
	@ObjectIdColumn()
	id!: ObjectId

	@IsDateString()
	@Column('date', {
		name: 'date',
		transformer: {
			to: (value: Date) => Dates.format(value, 'YYYY-MM-DD'),
			from: (value: string) => value,
		},
	})
	date!: Date

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly AUD!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly CAD!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly CHF!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly EUR!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly GBP!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly INR!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly MXN!: number

	@Column('decimal', { default: 1.0, precision: 20, scale: 10 })
	@IsNumber()
	readonly USD!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly JPY!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly CNY!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly HKD!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly NZD!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly SEK!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly KRW!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly SGD!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly NOK!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly RUB!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly ZAR!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly TRY!: number

	@Column('decimal', { precision: 20, scale: 10 })
	@IsNumber()
	readonly BRL!: number
}
