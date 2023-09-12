import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ScrapingBeeScrapeService } from './scrapingbee.scrape.service'
import { SpbConfig } from 'scrapingbee/src'

@Injectable()
export class ScrapingBeeService {
	constructor(
		@Inject(forwardRef(() => ScrapingBeeScrapeService))
		private readonly scrapingBeeScrapeService: ScrapingBeeScrapeService,
	) {}

	async scrape(options: SpbConfig): Promise<any> {
		return await this.scrapingBeeScrapeService.scrape(options)
	}
}
