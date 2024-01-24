import { IsString, IsBoolean, IsNumber, IsObject } from 'class-validator'
import { EverflowOffer } from '../offer/offer.dto'

export class EverflowConversionRelationships {
	@IsObject()
	offer!: EverflowOffer

	@IsNumber()
	events_count?: number
}

export class EverflowConversion {
	@IsString()
	conversion_id!: string

	@IsNumber()
	conversion_unix_timestamp!: number

	@IsString()
	sub1?: string

	@IsString()
	sub2?: string

	@IsString()
	sub3?: string

	@IsString()
	sub4?: string

	@IsString()
	sub5?: string

	@IsString()
	source_id?: string

	@IsString()
	revenue_type?: string

	@IsNumber()
	revenue?: number

	@IsString()
	session_user_ip?: string

	@IsString()
	conversion_user_ip?: string

	@IsString()
	country?: string

	@IsString()
	region?: string

	@IsString()
	city?: string

	@IsNumber()
	dma?: number

	@IsString()
	carrier?: string

	@IsString()
	platform?: string

	@IsString()
	os_version?: string

	@IsString()
	device_type?: string

	@IsString()
	brand?: string

	@IsString()
	browser?: string

	@IsString()
	language?: string

	@IsString()
	http_user_agent?: string

	@IsBoolean()
	is_event?: boolean

	@IsString()
	event!: string

	@IsString()
	transaction_id?: string

	@IsNumber()
	click_unix_timestamp?: number

	@IsString()
	isp?: string

	@IsString()
	referer?: string

	@IsString()
	app_id?: string

	@IsString()
	idfa?: string

	@IsString()
	idfa_md5?: string

	@IsString()
	idfa_sha1?: string

	@IsString()
	google_ad_id?: string

	@IsString()
	google_ad_id_md5?: string

	@IsString()
	google_ad_id_sha1?: string

	@IsString()
	android_id?: string

	@IsString()
	android_id_md5?: string

	@IsString()
	android_id_sha1?: string

	@IsString()
	currency_id?: string

	@IsBoolean()
	is_view_through?: boolean

	@IsString()
	order_id?: string

	@IsString()
	adv1?: string

	@IsString()
	adv2?: string

	@IsString()
	adv3?: string

	@IsString()
	adv4?: string

	@IsString()
	adv5?: string

	@IsNumber()
	sale_amount?: number

	@IsObject()
	relationship!: EverflowConversionRelationships
}
