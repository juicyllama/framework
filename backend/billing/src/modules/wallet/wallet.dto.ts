import { IsEnum, IsNumber } from 'class-validator'
import { SupportedCurrencies } from '@juicyllama/utils'

export class GetBalanceResponseDto {
	@IsNumber()
	balance: number

	@IsEnum(SupportedCurrencies)
	currency: SupportedCurrencies
}
