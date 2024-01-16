import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, MaxLength, MinLength } from 'class-validator'
import { SupportedCurrencies } from '@juicyllama/utils'

export class PricingDto {
	@ApiProperty({ description: 'The amount to charge for this package', example: 9.99 })
	@IsNumber()
	amount!: number

	@ApiProperty({ description: 'The currency for the package price', example: SupportedCurrencies.USD })
	@IsEnum(SupportedCurrencies)
	@MinLength(3)
	@MaxLength(3)
	currency!: SupportedCurrencies
}
