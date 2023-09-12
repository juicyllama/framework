import { IsString, IsNumber } from 'class-validator'

export class EverflowAffiliateReportingClicksBody {
	@IsString()
	from: string // dates in YYYY-mm-DD HH:MM:SS format

	@IsString()
	to: string // dates in YYYY-mm-DD HH:MM:SS format

	@IsNumber()
	timezone_id?: number // Find all timezones here - https://developers.everflow.io/docs/metadata/timezones/#find-all we default to UTC if no timezone provided
}
