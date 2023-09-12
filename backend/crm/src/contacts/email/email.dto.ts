import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator'
import { ContactEmailType } from './email.enums'

export class ContactEmailDto {
	@ApiProperty({ description: 'The contacts email type', example: ContactEmailType.WORK, enum: ContactEmailType })
	@IsEnum(ContactEmailType)
	@IsOptional()
	type?: ContactEmailType

	@ApiProperty({ description: 'Your contacts email address', example: 'richard.branson@fly.virgin.com' })
	@IsEmail()
	@MinLength(2)
	@MaxLength(2)
	email: string
}
