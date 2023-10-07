import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean, IsObject } from 'class-validator'
import { ShopifyMarketingConsent } from '../shopify.common.dto'

export class ShopifyCustomer {
	@IsNumber()
	@IsOptional()
	id?: number

	@IsString()
	@IsOptional()
	email?: string

	@IsBoolean()
	@IsOptional()
	accepts_marketing?: boolean

	@IsDateString()
	@IsOptional()
	created_at?: Date

	@IsDateString()
	@IsOptional()
	updated_at?: Date

	@IsString()
	@IsOptional()
	first_name?: string

	@IsString()
	@IsOptional()
	last_name?: string

	@IsString()
	@IsOptional()
	state?: string

	@IsString()
	@IsOptional()
	note?: string

	@IsBoolean()
	@IsOptional()
	verified_email?: boolean

	@IsString()
	@IsOptional()
	multipass_identifier?: string

	@IsBoolean()
	@IsOptional()
	tax_exempt?: boolean

	@IsString()
	@IsOptional()
	phone?: string

	@IsString()
	@IsOptional()
	tags?: string

	@IsString()
	@IsOptional()
	currency?: string

	@IsDateString()
	@IsOptional()
	accepts_marketing_updated_at?: Date

	@IsString()
	@IsOptional()
	marketing_opt_in_level?: string

	@IsObject()
	@IsOptional()
	email_marketing_consent?: ShopifyMarketingConsent

	@IsObject()
	@IsOptional()
	sms_marketing_consent?: ShopifyMarketingConsent
}
