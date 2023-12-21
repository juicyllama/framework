import { IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsString } from 'class-validator'
import { WiseAmountDto } from '../wise.dto'
import { WiseBalanceInvestmentState, WiseBalanceType } from './wise.balance.enums'

export class WiseBalanceDto {
	@IsNumber()
	id: number

	@IsString()
	currency: string

	@IsEnum(WiseBalanceType)
	type: WiseBalanceType

	@IsString()
	name: string

	@IsString()
	icon: string

	@IsEnum(WiseBalanceInvestmentState)
	investmentState: WiseBalanceInvestmentState

	@IsObject()
	amount: WiseAmountDto

	@IsObject()
	reservedAmount: WiseAmountDto

	@IsObject()
	cashAmount: WiseAmountDto

	@IsObject()
	totalWorth: WiseAmountDto

	@IsDate()
	creationTime: Date

	@IsDate()
	modificationTime: Date

	@IsBoolean()
	visible: boolean
}
