import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class WithdrawalRequestDto {
	@ApiProperty({
		description: 'The amount you wish to withdraw in your account currency.',
		example: 123.45,
		required: true,
	})
	@IsNumber()
	amount!: number

	@ApiProperty({
		description: 'The ID of the payment method you wish the funds to be sent to.',
		example: 1,
		required: true,
	})
	@IsNumber()
	payment_method_id!: number
}
