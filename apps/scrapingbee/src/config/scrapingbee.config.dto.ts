import { IsString } from 'class-validator'

export class ScrapingbeeConfigDto {
	@IsString()
	SCRAPINGBEE_API_KEY: string
}
