import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator'
import { ShopifyRestList } from '../shopify.common.dto'
import { ShopifyWebhooksTopics } from './webhooks.enums'
import { PartialType } from '@nestjs/swagger'

export class ShopifyWebhook {
	@IsNumber()
	id: number

	@IsString()
	address: string

	@IsEnum(ShopifyWebhooksTopics)
	@IsOptional()
	topic?: ShopifyWebhooksTopics

	@IsString()
	format: string

	@IsDateString()
	@IsOptional()
	created_at?: Date

	@IsDateString()
	@IsOptional()
	updated_at?: Date

	@IsString()
	@IsOptional()
	fields?: string
}

export class ShopifyWebhookCreate extends PartialType(ShopifyWebhook) {}

export class ShopifyRestListWebhooks extends ShopifyRestList {
	@IsString()
	@IsOptional()
	address?: string

	@IsEnum(ShopifyWebhooksTopics)
	@IsOptional()
	topic?: ShopifyWebhooksTopics
}
