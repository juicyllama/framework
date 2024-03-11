import { IsString } from 'class-validator'

export class GoogleAnalyticsConfigDto {
	@IsString()
	BASE_URL_API: string = null

	@IsString()
	GA4_OAUTH_CLIENT_ID: string = null

	@IsString()
	GA4_OAUTH_CLIENT_SECRET: string = null
}
