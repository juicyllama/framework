import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsUrl, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class WebsiteDto {
	@ApiProperty({ description: 'Website Name', example: 'Google' })
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	name: string

	@ApiProperty({ description: 'The website URL', example: 'https://google.com' })
	@IsString()
	@IsUrl()
	url?: string

	@ApiProperty({ description: 'The URL of your website screenshot' })
	@IsOptional()
	@IsString()
	@IsUrl()
	screenshot_url?: string

	@ApiProperty({ description: 'The URL of your websites icon (e.g. a favicon)' })
	@IsOptional()
	@IsString()
	@IsUrl()
	icon_url?: string
}

export class CreateWebsiteDto extends WebsiteDto {}

export class UpdateWebsiteDto extends PartialType(WebsiteDto) {}
