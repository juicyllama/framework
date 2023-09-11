import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class CompletePasswordResetDto {
	@IsEmail()
	@IsString()
	@ApiProperty({
		description: 'The users email address',
		example: 'richard.branson@fly.virgin.com',
	})
	readonly email: string

	@IsString()
	@IsNotEmpty()
	readonly code: string

	@ApiProperty({
		example: 'S7rOngP@s7',
	})
	@IsString()
	@MinLength(8)
	@MaxLength(50)
	newPassword: string
}

export class InitiateResetPasswordDto {
	@IsEmail()
	@ApiProperty({
		description: 'The users email address',
		example: 'richard.branson@fly.virgin.com',
	})
	readonly email: string
}
