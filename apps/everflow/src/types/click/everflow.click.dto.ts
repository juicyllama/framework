import { IsString, IsUrl, IsNumber, IsObject } from 'class-validator'
import { EverflowOffer } from '../offer/offer.dto'
import { EverflowDevice } from '../everflow.device.dto'
import { EverflowGeolocation } from '../everflow.geolocation.dto'

export class EverflowClickRelationships {
	@IsObject()
	offer!: EverflowOffer

	@IsObject()
	geolocation!: EverflowGeolocation

	@IsObject()
	device_information!: EverflowDevice

	@IsObject()
	query_parameters?: any
}

export class EverflowClick {
	@IsString()
	transaction_id!: string

	@IsNumber()
	is_unique!: number

	@IsNumber()
	unix_timestamp!: number

	@IsString()
	tracking_url?: string

	@IsString()
	source_id?: string

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
	revenue_type?: string

	@IsNumber()
	revenue?: number

	@IsUrl()
	referer?: string

	@IsNumber()
	error_code?: number

	@IsString()
	user_ip?: string

	@IsString()
	error_message?: string

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

	@IsObject()
	relationship!: EverflowClickRelationships
}
