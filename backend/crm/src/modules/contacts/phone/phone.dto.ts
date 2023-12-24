import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ContactPhoneType } from './phone.enums'

export class ContactPhoneDto {
	@ApiProperty({ description: 'The contacts email type', example: ContactPhoneType.MOBILE, enum: ContactPhoneType })
	@IsEnum(ContactPhoneType)
	@IsOptional()
	type?: ContactPhoneType

	@ApiProperty({ description: 'The phone numbers country code', example: 'US' })
	@IsString()
	@IsOptional() //we will try and determine this from the number
	@MinLength(2)
	@MaxLength(2)
	country_iso?: string

	@ApiProperty({ description: 'Your contacts phone number', example: '650-762-7000' })
	@IsString()
	number: string

	@IsString()
	@IsOptional()
	number_local_format?: string
}
