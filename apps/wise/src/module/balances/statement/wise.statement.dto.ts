import { IsArray, IsDate, IsEnum, IsNumber, IsObject, IsString } from 'class-validator'
import { WiseAddressDto, WiseAmountDto } from '../../wise.dto'
import { WiseStatementAccountHolderType, WiseTransactionDetailsType, WiseTransactionType } from './wise.statement.enums'

export class WiseGetTransactionsRequestDto {
	@IsNumber()
	balanceId: number

	@IsDate()
	intervalStart: Date

	@IsDate()
	intervalEnd: Date
}

export class WiseStatementAccountHolderDto {
	@IsEnum(WiseStatementAccountHolderType)
	type: WiseStatementAccountHolderType

	@IsObject()
	address: WiseAddressDto

	@IsString()
	firstName: string

	@IsString()
	lastName: string
}

export class WiseStatementIssuerDto extends WiseAddressDto {
	@IsString()
	name: string
}

export class WiseTransactionDetailsMerchantDto extends WiseAddressDto {
	@IsString()
	name: string

	@IsString()
	category: string
}

export class WiseTransactionDetailsDto {
	@IsEnum(WiseTransactionDetailsType)
	type: WiseTransactionDetailsType

	@IsString()
	description: string

	@IsObject()
	amount: WiseAmountDto

	@IsObject()
	sourceAmount: WiseAmountDto

	@IsObject()
	targetAmount: WiseAmountDto

	@IsObject()
	fee: WiseAmountDto

	@IsNumber()
	rate: number

	@IsString()
	senderName: string

	@IsString()
	senderAccount: string

	@IsString()
	paymentReference: string // Deposit payment reference text

	@IsString()
	category: string

	@IsObject()
	merchant: WiseTransactionDetailsMerchantDto
}

export class WiseTransactionExchangeDetailsDto {
	@IsObject()
	forAmount: WiseAmountDto

	@IsNumber()
	rate: number
}

export class WiseTransactionDto {
	@IsEnum(WiseTransactionType)
	type: WiseTransactionType

	@IsDate()
	date: Date

	@IsObject()
	amount: WiseAmountDto

	@IsObject()
	totalFees: WiseAmountDto

	@IsObject()
	details: WiseTransactionDetailsDto

	@IsObject()
	exchangeDetails: WiseTransactionExchangeDetailsDto

	@IsObject()
	runningBalance: WiseAmountDto

	@IsString()
	referenceNumber: string // Wise assigned unique transaction reference number
}

export class WiseStatementQueryDto {
	@IsDate()
	intervalStart: Date

	@IsDate()
	intervalEnd: Date

	@IsString()
	currency: string

	@IsNumber()
	accountId: number
}

export class WiseStatementDto {
	@IsObject()
	accountHolder: WiseStatementAccountHolderDto

	@IsObject()
	issuer: WiseStatementIssuerDto

	@IsArray()
	transactions: []

	@IsObject()
	endOfStatementBalance: WiseAmountDto

	@IsObject()
	query: WiseStatementQueryDto
}
