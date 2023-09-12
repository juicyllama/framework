import { IsString, IsBoolean, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class UserDto {
	user_id?: number

	@ApiProperty({
		description: 'The users first name',
		example: 'Richard',
		required: false,
	})
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@IsOptional()
	first_name?: string

	@ApiProperty({
		example: 'Branson',
		required: false,
	})
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@IsOptional()
	last_name?: string

	@ApiProperty({
		example: 'richard.branson@fly.virgin.com',
	})
	@IsString()
	@IsEmail()
	email: string

	@ApiProperty({
		example: 'S7rOngP@s7',
	})
	@IsString()
	@MinLength(8)
	@MaxLength(50)
	@IsOptional()
	/*@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password too weak',
	})*/
	password?: string

	@ApiProperty({
		example: false,
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	password_reset?: boolean
}

export class CreateUserDto extends UserDto {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
