import { IsString, IsOptional } from 'class-validator'

export class WebsitesConfigDto {
	@IsString()
	@IsOptional()
	CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE?: string

	@IsString()
	@IsOptional()
	CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_FREQUENCY?: string

	@IsString()
	@IsOptional()
	CRON_WEBSITES_WEBSITE_ICON_GENERATE?: string

	@IsString()
	@IsOptional()
	CRON_WEBSITES_WEBSITE_ICON_GENERATE_FREQUENCY?: string
}
