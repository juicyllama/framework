import { IsOptional, IsString } from 'class-validator'

export class BeaconConfigDto {
	@IsOptional()
	@IsString()
	SYSTEM_EMAIL_ADDRESS?: string

	@IsOptional()
	@IsString()
	SYSTEM_EMAIL_NAME?: string
}
