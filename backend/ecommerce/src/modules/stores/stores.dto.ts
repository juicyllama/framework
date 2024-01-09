import { BaseResponseDto, SwaggerPropertyDecorator } from '@juicyllama/core'
import { Classes } from '@juicyllama/utils'
import { PartialType } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class StoreDto {
	@SwaggerPropertyDecorator({ description: 'The ID of the website you want to link the ecommerce store to' })
	@IsOptional()
	@IsNumber()
	website_id?: number

	@SwaggerPropertyDecorator({ description: 'The ID of the installed app you want to link the ecommerce store to' })
	@IsOptional()
	@IsNumber()
	installed_app_id?: number
}

export class CreateStoreDto extends StoreDto {}

export class UpdateStoreDto extends PartialType(StoreDto) {}

export class StoreResponeDto extends Classes.ExtendsMultiple([StoreDto, BaseResponseDto]) {
	@SwaggerPropertyDecorator({ description: 'The store ID', example: 1 })
	readonly store_id: number
}
