import { IsBoolean, IsString } from 'class-validator'

export class EverflowDevice {
	@IsBoolean()
	is_mobile?: boolean

	@IsString()
	platform_name?: string

	@IsString()
	os_version?: string

	@IsString()
	brand?: string

	@IsString()
	model?: string

	@IsBoolean()
	is_tablet?: boolean

	@IsString()
	browser_name?: string

	@IsString()
	browser_version?: string

	@IsString()
	device_type?: string

	@IsString()
	language?: string

	@IsString()
	http_accept_language?: string

	@IsBoolean()
	is_robot?: boolean

	@IsBoolean()
	is_filter?: boolean
}
