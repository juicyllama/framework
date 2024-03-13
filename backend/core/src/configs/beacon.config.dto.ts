import { IsString, IsBoolean, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class BeaconConfigDto {
	@IsOptional()
	@IsString()
	SYSTEM_EMAIL_ADDRESS?: string

	@IsOptional()
	@IsString()
	SYSTEM_EMAIL_NAME?: string

	@IsOptional()
	@IsString()
	PUSHER_APP_ID?: string

	@IsOptional()
	@IsString()
	PUSHER_APP_KEY?: string

	@IsOptional()
	@IsString()
	PUSHER_APP_SECRET?: string

	@IsOptional()
	@IsString()
	PUSHER_APP_CLUSTER?: string

	@Transform(({ value }) => [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1)
	@IsOptional()
	@IsBoolean()
	PUSHER_USE_TLS?: boolean = true

	@IsOptional()
	@IsString()
	PUSHER_CHANNEL?: string
}
