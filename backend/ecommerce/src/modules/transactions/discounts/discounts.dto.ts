import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator'
import { TransactionDiscountType } from './discounts.enums'

export class TransactionDiscountDto {
	@ApiProperty({ description: 'The ID of the transaction you want to link the discount to' })
	@IsNumber()
	transaction_id!: number

	@ApiProperty({ description: 'The amount the discount will reduce from the transaction total' })
	@IsNumber({ maxDecimalPlaces: 2 })
	amount!: number

	@ApiProperty({ description: 'The code of the discount' })
	@IsString()
	code!: string

	@ApiProperty({ description: 'The type of discount' })
	@IsOptional()
	@IsEnum(TransactionDiscountType)
	type?: TransactionDiscountType
}

export class CreateTransactionDiscountDto extends TransactionDiscountDto {}

export class UpdateTransactionDiscountDto extends PartialType(TransactionDiscountDto) {}
