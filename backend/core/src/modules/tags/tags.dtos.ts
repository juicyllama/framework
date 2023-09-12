import { IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class TagDto {
	@ApiProperty({ description: 'The name of your tag', example: 'TAG' })
	@IsString()
	@MinLength(2)
	@MaxLength(255)
	name: string
}

export class CreateTagDto extends TagDto {}

export class UpdateTagDto extends PartialType(TagDto) {}
