import { Injectable } from '@nestjs/common'
import { SpbConfig } from 'scrapingbee'
import { ScrapingBeeScrapeService } from './scrapingbee.scrape.service'

@Injectable()
export class ScrapingBeeService {
	constructor(private readonly scrapingBeeScrapeService: ScrapingBeeScrapeService) {}

	async scrape(options: SpbConfig): Promise<any> {
		return await this.scrapingBeeScrapeService.scrape(options)
	}
}
