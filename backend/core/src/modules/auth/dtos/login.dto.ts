import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginResponseDto {
	access_token: string
	refresh_token?: string

	constructor(token: string) {
		this.access_token = token
	}

	setRefreshToken(token: string) {
		this.refresh_token = token
	}
}

export class LoginRequestDto {
	@IsEmail()
	@IsString()
	@ApiProperty({
		description: 'The users email address',
		example: 'jon.doe@example.com',
	})
	readonly email!: string

	@ApiProperty({
		example: 'S7rOngP@s7',
	})
	@IsString()
	@MinLength(8)
	@MaxLength(50)
	readonly password!: string
}

export class ValidateCodeDto {
	@IsEmail()
	@IsString()
	@ApiProperty({
		description: 'The users email address',
		example: 'jon.doe@example.com',
	})
	readonly email!: string

	@IsString()
	@IsNotEmpty()
	readonly code!: string
}
