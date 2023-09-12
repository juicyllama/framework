import { IsBoolean, IsNumber, IsString, IsUrl, IsObject } from 'class-validator'

export class EverflowOfferRelations {
	@IsString()
	offer_affiliate_status?: string
}

export class EverflowOffer {
	@IsNumber()
	network_offer_id: number

	@IsNumber()
	network_id: number

	@IsString()
	name: string

	@IsString()
	offer_status: string

	@IsNumber()
	network_tracking_domain_id?: number

	@IsUrl()
	thumbnail_url?: string

	@IsNumber()
	network_category_id?: number

	@IsUrl()
	preview_url?: string

	@IsString()
	currency_id?: string

	@IsNumber()
	caps_timezone_id?: number

	@IsString()
	date_live_until?: string

	@IsString()
	html_description?: string

	@IsBoolean()
	is_using_explicit_terms_and_conditions?: boolean

	@IsString()
	terms_and_conditions?: string

	@IsBoolean()
	is_force_terms_and_conditions?: boolean

	@IsString()
	visibility?: string

	@IsBoolean()
	is_caps_enabled?: boolean

	@IsBoolean()
	is_using_suppression_list?: boolean

	@IsNumber()
	suppression_list_id?: number

	@IsNumber()
	daily_conversion_cap?: number

	@IsNumber()
	weekly_conversion_cap?: number

	@IsNumber()
	monthly_conversion_cap?: number

	@IsNumber()
	global_conversion_cap?: number

	@IsNumber()
	daily_payout_cap?: number

	@IsNumber()
	weekly_payout_cap?: number

	@IsNumber()
	monthly_payout_cap?: number

	@IsNumber()
	global_payout_cap?: number

	@IsNumber()
	daily_click_cap?: number

	@IsNumber()
	weekly_click_cap?: number

	@IsNumber()
	monthly_click_cap?: number

	@IsNumber()
	global_click_cap?: number

	@IsUrl()
	tracking_url?: string

	@IsString()
	app_identifier?: string

	@IsNumber()
	time_created?: number

	@IsNumber()
	time_saved?: number

	@IsBoolean()
	is_description_plain_text?: boolean

	@IsBoolean()
	is_use_direct_linking?: boolean

	@IsObject()
	relationship?: EverflowOfferRelations

	@IsUrl()
	impression_tracking_url?: string
}
