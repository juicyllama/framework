import { IsString, MaxLength, MinLength } from 'class-validator'
import { PartialType } from '@nestjs/swagger'
import { SwaggerPropertyDecorator } from '../../decorators/Swagger.decorator'
import { BaseResponseDto } from '../../types/common'
import { Classes } from '@juicyllama/utils'

export class TagDto {
	@SwaggerPropertyDecorator({ description: 'The name of your tag', example: 'TAG' })
	@IsString()
	@MinLength(2)
	@MaxLength(255)
	name!: string
}

export class CreateTagDto extends TagDto {}

export class UpdateTagDto extends PartialType(TagDto) {}

export class TagResponceDto extends Classes.ExtendsMultiple([TagDto, BaseResponseDto]) {
	@SwaggerPropertyDecorator({ description: 'The Tag ID', example: 1 })
	readonly tag_id!: number
}
