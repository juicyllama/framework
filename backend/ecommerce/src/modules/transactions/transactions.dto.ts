import { PartialType } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsEnum, MinLength, MaxLength, IsBoolean, IsDate } from 'class-validator'
import { TransactionFulfillmentStatus, TransactionPaymentStatus } from './transactions.enums'
import { Classes } from '@juicyllama/utils'
import { BaseResponseDto, SwaggerPropertyDecorator } from '@juicyllama/core'

export class TransactionDto {
	@SwaggerPropertyDecorator({ description: 'The store you would like to link the transaction to' })
	@IsOptional()
	@IsNumber()
	store_id?: number

	@SwaggerPropertyDecorator({ description: 'The order id of the transaction' })
	@IsString()
	order_id!: string

	@SwaggerPropertyDecorator({ description: 'An optional additional order number' })
	@IsOptional()
	@IsString()
	order_number?: string

	@SwaggerPropertyDecorator({ description: 'The contact id of the contact' })
	@IsOptional()
	@IsNumber()
	contact_id?: number

	@SwaggerPropertyDecorator({ description: 'The address id of the shipping contact' })
	@IsOptional()
	@IsNumber()
	shipping_address_id?: number

	@SwaggerPropertyDecorator({ description: 'The address id of the billing contact' })
	@IsOptional()
	@IsNumber()
	billing_address_id?: number

	@SwaggerPropertyDecorator({ description: 'The payment status of the transaction' })
	@IsOptional()
	@IsEnum(TransactionPaymentStatus)
	payment_status?: TransactionPaymentStatus

	@SwaggerPropertyDecorator({ description: 'The fulfillment status of the transaction' })
	@IsOptional()
	@IsEnum(TransactionFulfillmentStatus)
	fulfillment_status?: TransactionFulfillmentStatus

	@SwaggerPropertyDecorator({ description: 'The currency of the transaction' })
	@IsString()
	@MinLength(3)
	@MaxLength(3)
	currency!: string

	@SwaggerPropertyDecorator({ description: 'The subtotal of the transaction' })
	@IsNumber()
	subtotal_price!: number

	@SwaggerPropertyDecorator({ description: 'The total shipping cost for the transaction' })
	@IsNumber()
	@IsOptional()
	total_shipping?: number

	@SwaggerPropertyDecorator({ description: 'The total discounts of the transaction' })
	@IsNumber()
	@IsOptional()
	total_discounts?: number

	@SwaggerPropertyDecorator({ description: 'The total outstanding of the transaction' })
	@IsNumber()
	@IsOptional()
	total_outstanding?: number

	@SwaggerPropertyDecorator({ description: 'The total price of the transaction' })
	@IsNumber()
	total_price!: number

	@SwaggerPropertyDecorator({ description: 'The total tax of the transaction' })
	@IsNumber()
	total_tax!: number

	@SwaggerPropertyDecorator({ description: 'If this transaction is a test' })
	@IsOptional()
	@IsBoolean()
	test?: boolean

	@SwaggerPropertyDecorator({ description: 'The cancellation date of the transaction' })
	@IsOptional()
	@IsDate()
	cancelled_at?: Date

	@SwaggerPropertyDecorator({ description: 'The reason for cancelling the transaction' })
	@IsString()
	@IsOptional()
	cancel_reason?: string

	@SwaggerPropertyDecorator({ description: 'The refund date of the transaction' })
	@IsOptional()
	@IsDate()
	refunded_at?: Date
}

export class CreateTransactionDto extends TransactionDto {}

export class UpdateTransactionDto extends PartialType(TransactionDto) {}

export class TransactionResponeDto extends Classes.ExtendsMultiple([TransactionDto, BaseResponseDto]) {
	@SwaggerPropertyDecorator({ description: 'The Transaction ID', example: 1 })
	readonly transaction_id!: number
}
