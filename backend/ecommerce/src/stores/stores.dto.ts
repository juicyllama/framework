import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class StoreDto {
	@ApiProperty({ description: 'The ID of the website you want to link the ecommerce store to' })
	@IsOptional()
	@IsNumber()
	website_id?: number

	@ApiProperty({ description: 'The ID of the installed app you want to link the ecommerce store to' })
	@IsOptional()
	@IsNumber()
	installed_app_id?: number
}

export class CreateStoreDto extends StoreDto {}

export class UpdateStoreDto extends PartialType(StoreDto) {}
