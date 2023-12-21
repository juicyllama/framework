import { IsString } from 'class-validator'

export class WiseConfigDto {
	@IsString()
	WISE_API_KEY: string

	@IsString()
	WISE_PROFILE_ID: string

	@IsString()
	WISE_BALANCE_IDS: string
}
