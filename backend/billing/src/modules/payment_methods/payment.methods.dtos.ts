import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsObject, IsString } from 'class-validator'
import { PaymentMethodType } from './payment.methods.enums'
import { SupportedCurrencies } from '@juicyllama/utils'

export class PaymentMethodCreditCardDetails {
	@IsString()
	cardHolder: string

	@IsString()
	cardNumber: string

	@IsString()
	cardLabel: string

	@IsString()
	cardFingerprint: string

	@IsDate()
	cardExpireDate: Date
}

export class PaymentMethodBankTransferGBPDetails {
	@ApiProperty({ description: 'Your bank account sort code', example: '12-34-56' })
	@IsString()
	sort_code: string

	@ApiProperty({ description: 'Your bank account number', example: '12345678' })
	@IsString()
	account_number: string
}

export class PaymentMethodBankTransferEURDetails {
	@ApiProperty({ description: 'Your bank account IBAN', example: 'DE75512108001245126199' })
	@IsString()
	iban: string
}

export class PaymentMethodBankTransferUSDDetails {
	@ApiProperty({ description: 'Your bank account routing number', example: '123456789' })
	@IsString()
	routing_number: string

	@ApiProperty({ description: 'Your bank account number', example: '000123456789' })
	@IsString()
	account_number: string
}

export class PaymentMethodBankTransferDetails {
	@ApiProperty({ description: 'Your bank name', example: '123456789' })
	@IsString()
	bank_name?: string

	@IsObject()
	account_details:
		| PaymentMethodBankTransferGBPDetails
		| PaymentMethodBankTransferEURDetails
		| PaymentMethodBankTransferUSDDetails
}

export class PaymentMethodDetails {
	@ApiProperty({
		description: 'The payment method you want to create',
		enum: PaymentMethodType,
		example: PaymentMethodType.creditcard,
	})
	@IsEnum(PaymentMethodType)
	method: PaymentMethodType

	@ApiProperty({
		description: 'The currency of the payment method',
		enum: SupportedCurrencies,
		example: SupportedCurrencies.USD,
	})
	@IsEnum(SupportedCurrencies)
	currency: SupportedCurrencies

	@ApiProperty({
		description: 'The location to redirect the user to after completing the payment',
		example: 'https://your.app/address',
	})
	@IsString()
	redirect_url: string
}

export class CreatePaymentMethodDto {
	@IsObject()
	payment_method: PaymentMethodDetails

	@ApiProperty({ description: 'A description of the payment method', example: 'My first payment method' })
	@IsString()
	description?: string
}
