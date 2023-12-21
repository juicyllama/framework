import { Body, Controller, Post } from '@nestjs/common'
import { SpbConfig } from 'scrapingbee'
import { ScrapingBeeService } from '../scrapingbee/scrapingbee.service'

@Controller('/')
export class SandboxController {
	constructor(private readonly scrapingBeeService: ScrapingBeeService) {}

	@Post()
	async message(@Body() options: SpbConfig) {
		try {
			return await this.scrapingBeeService.scrape(options)
		} catch (e) {
			console.log(e)
		}
	}
}
