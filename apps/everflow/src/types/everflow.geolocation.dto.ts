import { IsBoolean, IsNumber, IsString } from 'class-validator'

export class EverflowGeolocation {
	@IsString()
	country_code?: string

	@IsString()
	country_name?: string

	@IsString()
	region_code?: string

	@IsString()
	region_name?: string

	@IsString()
	city_name?: string

	@IsNumber()
	dma?: number

	@IsString()
	dma_name?: string

	@IsString()
	timezone?: string

	@IsString()
	carrier_name?: string

	@IsNumber()
	carrier_code?: number

	@IsString()
	organization?: string

	@IsString()
	isp_name?: string

	@IsBoolean()
	is_mobile?: boolean

	@IsBoolean()
	is_proxy?: boolean

	@IsString()
	postal_code?: string
}
