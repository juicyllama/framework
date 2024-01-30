import { SupportedCurrencies } from '@juicyllama/utils'
import { IsEnum, IsNumber } from 'class-validator'

export class GetBalanceResponseDto {
	@IsNumber()
	balance!: number

	@IsEnum(SupportedCurrencies)
	currency!: SupportedCurrencies
}
