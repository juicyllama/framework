import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ContactEmailDto } from './email/email.dto'
import { ContactPhoneDto } from './phone/phone.dto'
import { ContactSocialDto } from './social/social.dto'
import { ContactAddressDto } from './address/address.dto'
import { UserAvatarType } from '@juicyllama/core'

export class ContactDto {
	@ApiProperty({ description: 'Your contacts first name', example: 'John' })
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@IsOptional()
	first_name?: string

	@ApiProperty({ description: 'Your contacts last name', example: 'Doe' })
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@IsOptional()
	last_name?: string

	@ApiProperty({ description: 'Your contacts email addresses' })
	@IsOptional()
	@IsArray()
	emails?: ContactEmailDto[]

	@ApiProperty({ description: 'Your contacts phone numbers' })
	@IsOptional()
	@IsArray()
	phones?: ContactPhoneDto[]

	@ApiProperty({ description: 'Your contacts social profiles' })
	@IsOptional()
	@IsArray()
	socials?: ContactSocialDto[]

	@ApiProperty({ description: 'Your contacts addresses' })
	@IsOptional()
	@IsArray()
	addresses?: ContactAddressDto[]

	@ApiProperty({ description: 'Any tags you want to add to this contact', example: ['VIP', 'Over60'] })
	@IsOptional()
	@IsArray()
	tags?: string[]

	@ApiProperty({ description: 'If you want to use an avatar, which type?', example: UserAvatarType.IMAGE })
	@IsOptional()
	@IsEnum(UserAvatarType)
	avatar_type?: UserAvatarType

	@ApiProperty({
		description: 'Required if `avatar_type=GRAVATAR` or `avatar_type=IMAGE`',
		example: 'https://i.pinimg.com/originals/5a/86/32/5a8632249b50b5f58dffdcb0de7b838a.jpg',
	})
	@IsOptional()
	@IsString()
	avatar_image_url?: string

	@ApiProperty({ description: 'The date of birth of your contact', example: '1950-07-18' })
	@IsOptional()
	@IsDateString()
	dob?: Date
}

export class CreateContactDto extends PartialType(ContactDto) {}

export class UpdateContactDto {
	@ApiProperty({ description: 'Your contacts first name', example: 'John' })
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@IsOptional()
	first_name?: string

	@ApiProperty({ description: 'Your contacts last name', example: 'Doe' })
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	@IsOptional()
	last_name?: string

	@ApiProperty({ description: 'Your contacts email addresses' })
	@IsOptional()
	@IsArray()
	emails?: ContactEmailDto[]

	@ApiProperty({ description: 'Your contacts phone numbers' })
	@IsOptional()
	@IsArray()
	phones?: ContactPhoneDto[]

	@ApiProperty({ description: 'Your contacts social profiles' })
	@IsOptional()
	@IsArray()
	socials?: ContactSocialDto[]

	@ApiProperty({ description: 'Your contacts addresses' })
	@IsOptional()
	@IsArray()
	addresses?: ContactAddressDto[]

	@ApiProperty({ description: 'If you want to use an avatar, which type?', example: UserAvatarType.IMAGE })
	@IsOptional()
	@IsEnum(UserAvatarType)
	avatar_type?: UserAvatarType

	@ApiProperty({
		description: 'Required if `avatar_type=GRAVATAR` or `avatar_type=IMAGE`',
		example: 'https://i.pinimg.com/originals/5a/86/32/5a8632249b50b5f58dffdcb0de7b838a.jpg',
	})
	@IsOptional()
	@IsString()
	avatar_image_url?: string

	@ApiProperty({ description: 'The date of birth of your contact', example: '1950-07-18' })
	@IsOptional()
	@IsDateString()
	dob?: Date
}
