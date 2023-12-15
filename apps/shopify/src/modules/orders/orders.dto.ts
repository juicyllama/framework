import { OmitType } from '@nestjs/mapped-types'
import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean, IsEnum, IsArray, IsObject } from 'class-validator'
import { ShopifyAddress, ShopifyMoney, ShopifyRestList } from '../shopify.common.dto'
import { ShopifyCustomer } from '../customers/customers.dto'
import { ShopifyOrderDicountCodeType, ShopifyOrderFinancialStatus, ShopifyOrderFulfillmentStatus } from './orders.enums'

export class ShopifyOrderDiscountCodes {
	@IsString()
	code: string

	@IsString()
	amount: string

	@IsEnum(ShopifyOrderDicountCodeType)
	type: ShopifyOrderDicountCodeType
}

export class ShopifyPriceSet {
	@IsObject()
	shop_money: ShopifyMoney

	@IsObject()
	presentment_money: ShopifyMoney
}

export class ShopifyOrder {
	@IsNumber()
	id: number

	@IsString()
	admin_graphql_api_id: string

	@IsNumber()
	app_id: number

	@IsString()
	@IsOptional()
	browser_ip?: string

	@IsBoolean()
	buyer_accepts_marketing: boolean

	@IsOptional()
	cancel_reason?: string

	@IsDateString()
	@IsOptional()
	cancelled_at?: Date

	@IsString()
	@IsOptional()
	cart_token?: string

	@IsNumber()
	checkout_id: number

	@IsString()
	@IsOptional()
	checkout_token?: string

	@IsDateString()
	@IsOptional()
	closed_at?: Date

	@IsString()
	@IsOptional()
	company?: string

	@IsBoolean()
	confirmed: boolean

	@IsString()
	@IsOptional()
	contact_email?: string

	@IsDateString()
	created_at: Date

	@IsString()
	currency: string

	@IsString()
	@IsOptional()
	customer_locale?: string

	@IsString()
	@IsOptional()
	device_id?: string

	@IsArray()
	@IsOptional()
	discount_codes?: ShopifyOrderDiscountCodes[]

	@IsString()
	@IsOptional()
	email?: string

	@IsEnum(ShopifyOrderFinancialStatus)
	@IsOptional()
	financial_status?: ShopifyOrderFinancialStatus

	@IsEnum(ShopifyOrderFulfillmentStatus)
	@IsOptional()
	fulfillment_status?: ShopifyOrderFulfillmentStatus

	@IsString()
	@IsOptional()
	landing_site?: string

	@IsString()
	@IsOptional()
	landing_site_ref?: string

	@IsNumber()
	@IsOptional()
	location_id?: number

	@IsNumber()
	@IsOptional()
	merchant_of_record_app_id?: number

	@IsString()
	name: string

	@IsString()
	@IsOptional()
	notes?: string

	@IsNumber()
	number: number

	@IsNumber()
	@IsOptional()
	order_number?: number

	@IsString()
	@IsOptional()
	order_status_url?: string

	@IsString()
	@IsOptional()
	phone?: string

	@IsString()
	@IsOptional()
	presentment_currency?: string

	@IsDateString()
	@IsOptional()
	processed_at?: Date

	@IsBoolean()
	taxes_included: boolean

	@IsBoolean()
	test: boolean

	@IsString()
	@IsOptional()
	token?: string

	@IsNumber()
	subtotal_price: number

	@IsObject()
	@IsOptional()
	subtotal_price_set?: ShopifyPriceSet

	@IsObject()
	@IsOptional()
	total_shipping_price_set?: ShopifyPriceSet

	@IsNumber()
	@IsOptional()
	total_discounts?: number

	@IsObject()
	@IsOptional()
	total_discounts_set?: ShopifyPriceSet

	@IsNumber()
	total_outstanding: number

	@IsNumber()
	total_price: number

	@IsObject()
	@IsOptional()
	total_price_set?: ShopifyPriceSet

	@IsNumber()
	total_tax: number

	@IsObject()
	@IsOptional()
	total_tax_set?: ShopifyPriceSet

	@IsNumber()
	@IsOptional()
	total_weight?: number

	@IsDateString()
	updated_at: Date

	@IsNumber()
	@IsOptional()
	user_id?: number

	@IsObject()
	@IsOptional()
	billing_address?: ShopifyAddress

	@IsObject()
	@IsOptional()
	shipping_address?: ShopifyAddress

	@IsObject()
	@IsOptional()
	customer?: ShopifyCustomer
}

export class ShopifyRestListOrders extends ShopifyRestList {
	@IsString()
	@IsOptional()
	attribution_app_id?: string

	@IsString()
	@IsOptional()
	financial_status?: string

	@IsString()
	@IsOptional()
	fulfillment_status?: string

	@IsString()
	@IsOptional()
	ids?: string

	@IsDateString()
	@IsOptional()
	processed_at_max?: Date

	@IsDateString()
	@IsOptional()
	processed_at_min?: Date

	@IsString()
	@IsOptional()
	status?: string
}

export class ShopifyQueryListOrders extends OmitType(ShopifyRestListOrders, ['status', 'api_version'] as const) {
	@IsNumber()
	installed_app_id: number
}
