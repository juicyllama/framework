import { Controller, forwardRef, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { CronGuard, CronRunner } from '@juicyllama/core'
import { WebsitesCronsService } from './websites.crons.service'
import {
	CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN,
	CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_DOMAIN,
} from './websites.constants'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('websites/website/crons')
export class WebsitesCronsController {
	constructor(
		@Inject(forwardRef(() => WebsitesCronsService)) private readonly websitesCronsService: WebsitesCronsService,
	) {}

	@Post('generate/screenshots')
	async generate_screenshots() {
		return await CronRunner(
			CRON_WEBSITES_WEBSITE_SCREENSHOT_GENERATE_DOMAIN,
			this.websitesCronsService.generateWebsiteScreenshots(),
		)
	}

	@Post('generate/icons')
	async generate_icons() {
		return await CronRunner(
			CRON_WEBSITES_WEBSITE_ICON_GENERATE_DOMAIN,
			this.websitesCronsService.generateWebsiteIcons(),
		)
	}
}
