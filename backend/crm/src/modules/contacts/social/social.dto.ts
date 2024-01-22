import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ContactSocialType } from './social.enums'

export class ContactSocialDto {
	@ApiProperty({
		description: 'The contacts social type',
		example: ContactSocialType.INSTAGRAM,
		enum: ContactSocialType,
	})
	@IsEnum(ContactSocialType)
	@IsOptional()
	type?: ContactSocialType

	@ApiProperty({ description: 'Your contacts social handle', example: '@richardbranson' })
	@IsString()
	handle!: string
}
