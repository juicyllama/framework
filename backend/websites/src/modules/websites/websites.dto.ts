import { BaseResponseDto, SwaggerPropertyDecorator, SwaggerPropertyType } from '@juicyllama/core'
import { Classes } from '@juicyllama/utils'
import { PartialType } from '@nestjs/swagger'
import { IsUrl, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class WebsiteDto {
	@SwaggerPropertyDecorator({
		description: 'Website Name',
		type: SwaggerPropertyType.STRING,
		example: 'Google',
		required: true,
	})
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	name!: string

	@SwaggerPropertyDecorator({
		description: 'The website URL',
		type: SwaggerPropertyType.STRING,
		example: 'https://google.com',
		required: true,
	})
	@IsString()
	@IsUrl()
	url!: string

	@SwaggerPropertyDecorator({
		description: 'The URL of your website screenshot',
		type: SwaggerPropertyType.STRING,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsUrl()
	screenshot_url?: string

	@SwaggerPropertyDecorator({
		description: 'The URL of your websites icon (e.g. a favicon)',
		type: SwaggerPropertyType.STRING,
		required: false,
	})
	@IsOptional()
	@IsString()
	@IsUrl()
	icon_url?: string
}

export class CreateWebsiteDto extends WebsiteDto {}

export class UpdateWebsiteDto extends PartialType(WebsiteDto) {}

export class WebsiteResponeDto extends Classes.ExtendsMultiple([WebsiteDto, BaseResponseDto]) {
	@SwaggerPropertyDecorator({ description: 'The website ID', example: 1 })
	readonly website_id!: number
}
