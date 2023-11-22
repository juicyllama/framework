import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
	access_token: string

	constructor(token: string) {
		this.access_token = token
	}
}

export class LoginRequestDto {
	@IsEmail()
	@IsString()
	@ApiProperty({
		description: 'The users email address',
		example: 'jon.doe@example.com',
	})
	readonly email: string

	@ApiProperty({
		example: 'S7rOngP@s7',
	})
	@IsString()
	@MinLength(8)
	@MaxLength(50)
	readonly password: string
}

export class ValidateCodeDto {
	@IsString()
	@IsNotEmpty()
	readonly code: string
}
