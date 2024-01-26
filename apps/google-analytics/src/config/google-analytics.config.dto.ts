import { IsString } from 'class-validator'

export class GoogleAnalyticsConfigDto {
	@IsString()
	GOOGLE_APPLICATION_CREDENTIALS: string
}
