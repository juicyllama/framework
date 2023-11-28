import { IsString, IsNumber, IsOptional, IsJSON } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SettingsDto {
	id?: number

	@ApiProperty({
		description: 'The unique key for the setting',
		example: 'something::unique::key',
		required: true,
	})
	@IsString()
	key: string

	@ApiProperty({
		description: 'The json data for the key',
		example: '{"some":"json"}',
		required: true,
	})
	@IsJSON()
	value: any


}

export class CreateSettingsDto extends SettingsDto {

	@ApiProperty({
		description: 'The user_id for the setting if assigned to a specific user',
		example: 1,
		required: false,
	})
	@IsNumber()
	@IsOptional()
	user_id?: number

}

export class UpdateSettingsDto {

	@ApiProperty({
		description: 'The json data for the key',
		example: '{"some":"json"}',
		required: true,
	})
	@IsJSON()
	value: any

}