import { Body, Controller, forwardRef, Inject, Req, Post } from '@nestjs/common'
import { ScrapingBeeService } from '../scrapingbee/scrapingbee.service'
import { SpbConfig } from 'scrapingbee/src'

@Controller('/')
export class SandboxController {
	constructor(
		@Inject(forwardRef(() => ScrapingBeeService)) private readonly scrapingBeeService: ScrapingBeeService,
	) {}

	@Post()
	async message(@Req() req, @Body() options: SpbConfig) {
		try {
			return await this.scrapingBeeService.scrape(options)
		} catch (e) {
			console.log(e)
		}
	}
}
