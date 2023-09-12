import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator'

@Entity('billing_tax')
@Unique('billing_tax_UNIQUE', ['seller_country_code', 'buyer_country_code'])
export class Tax {
	@PrimaryGeneratedColumn()
	readonly tax_id: number

	@Column({ default: null, nullable: true })
	@IsString()
	@MinLength(2)
	@MaxLength(2)
	seller_country_code: string

	@Column({ default: null, nullable: true })
	@IsString()
	@MinLength(2)
	@MaxLength(2)
	buyer_country_code: string

	@IsNumber()
	@Column({ type: 'decimal', precision: 5, scale: 2, default: null, nullable: true })
	tax_percentage: number

	constructor(partial: Partial<Tax>) {
		Object.assign(this, partial)
	}
}
