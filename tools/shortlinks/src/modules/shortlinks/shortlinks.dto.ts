import { IsString, IsOptional, IsNumber } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class ShortenURLDto {
	@ApiProperty({
		description: 'The URL you would like shortened',
		example: 'https://someverylongurl.com/ext/index.html',
		required: true,
	})
	@IsString()
	long_url!: string

	@ApiProperty({
		description: 'The resource type you would like to associate with this shortlink',
		example: 'sms_message',
		required: false,
	})
	@IsOptional()
	@IsString()
	resource_type?: string

	@ApiProperty({
		description: 'The resource ID you would like to associate with this shortlink',
		example: 123,
		required: false,
	})
	@IsOptional()
	@IsNumber()
	resource_id?: number
}

export class UpdatShortenURLDto extends PartialType(ShortenURLDto) {}
