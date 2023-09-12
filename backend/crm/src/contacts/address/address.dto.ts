import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ContactAddressType } from './address.enums'

export class ContactAddressDto {
	@ApiProperty({ description: 'The type of address', example: ContactAddressType.HOME, enum: ContactAddressType })
	@IsEnum(ContactAddressType)
	@IsOptional()
	type?: ContactAddressType

	@ApiProperty({ description: 'Your contacts address line 1', example: "Richard's House" })
	@IsOptional()
	@IsString()
	address_1?: string

	@ApiProperty({ description: 'Your contacts address line 2', example: 'PO Box 1091, The Valley' })
	@IsOptional()
	@IsString()
	address_2?: string

	@ApiProperty({ description: 'Your contacts city', example: 'Virgin Gorda' })
	@IsOptional()
	@IsString()
	city?: string

	@ApiProperty({ description: 'Your contacts post code', example: '' })
	@IsOptional()
	@IsString()
	post_code?: string

	@ApiProperty({ description: 'Your contacts state', example: 'Necker Island' })
	@IsOptional()
	@IsString()
	state?: string

	@ApiProperty({ description: 'Your contacts country iso', example: 'VG' })
	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(2)
	country_iso?: string
}
