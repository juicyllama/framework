import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsEnum, MinLength, MaxLength, IsBoolean, IsDate } from 'class-validator'
import { TransactionFulfillmentStatus, TransactionPaymentStatus } from './transactions.enums'

export class TransactionDto {
	@ApiProperty({ description: 'The store you would like to link the transaction to' })
	@IsOptional()
	@IsNumber()
	store_id?: number

	@ApiProperty({ description: 'The order id of the transaction' })
	@IsString()
	order_id: string

	@ApiProperty({ description: 'An optional additional order number' })
	@IsOptional()
	@IsString()
	order_number?: string

	@ApiProperty({ description: 'The contact id of the contact' })
	@IsOptional()
	@IsNumber()
	contact_id?: number

	@ApiProperty({ description: 'The address id of the shipping contact' })
	@IsOptional()
	@IsNumber()
	shipping_address_id?: number

	@ApiProperty({ description: 'The address id of the billing contact' })
	@IsOptional()
	@IsNumber()
	billing_address_id?: number

	@ApiProperty({ description: 'The payment status of the transaction' })
	@IsOptional()
	@IsEnum(TransactionPaymentStatus)
	payment_status?: TransactionPaymentStatus

	@ApiProperty({ description: 'The fulfillment status of the transaction' })
	@IsOptional()
	@IsEnum(TransactionFulfillmentStatus)
	fulfillment_status?: TransactionFulfillmentStatus

	@ApiProperty({ description: 'The currency of the transaction' })
	@IsString()
	@MinLength(3)
	@MaxLength(3)
	currency: string

	@ApiProperty({ description: 'The subtotal of the transaction' })
	@IsNumber()
	subtotal_price: number

	@ApiProperty({ description: 'The total shipping cost for the transaction' })
	@IsNumber()
	@IsOptional()
	total_shipping?: number


	@ApiProperty({ description: 'The total discounts of the transaction' })
	@IsNumber()
	@IsOptional()
	total_discounts?: number

	@ApiProperty({ description: 'The total outstanding of the transaction' })
	@IsNumber()
	@IsOptional()
	total_outstanding?: number

	@ApiProperty({ description: 'The total price of the transaction' })
	@IsNumber()
	total_price: number

	@ApiProperty({ description: 'The total tax of the transaction' })
	@IsNumber()
	total_tax: number

	@ApiProperty({ description: 'If this transaction is a test' })
	@IsOptional()
	@IsBoolean()
	test?: boolean

	@ApiProperty({ description: 'The cancellation date of the transaction' })
	@IsOptional()
	@IsDate()
	cancelled_at?: Date

	@ApiProperty({ description: 'The reason for cancelling the transaction' })
	@IsString()
	@IsOptional()
	cancel_reason?: string

	@ApiProperty({ description: 'The refund date of the transaction' })
	@IsOptional()
	@IsDate()
	refunded_at?: Date

}

export class CreateTransactionDto extends TransactionDto {}

export class UpdateTransactionDto extends PartialType(TransactionDto) {}
