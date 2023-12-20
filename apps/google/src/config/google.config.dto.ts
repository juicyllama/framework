import { IsString } from 'class-validator'

export class GoogleConfigDto {
	@IsString()
	GOOGLE_MAPS_API_KEY: string
}
