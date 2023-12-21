import { Logger, Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { SpbConfig, ScrapingBeeClient } from 'scrapingbee'
import { InjectScrapingbee } from './scrapingbee.constants'

@Injectable()
export class ScrapingBeeScrapeService {
	constructor(
		private readonly logger: Logger,
		@InjectScrapingbee() private readonly client: ScrapingBeeClient,
	) {}

	async scrape(options: SpbConfig): Promise<any> {
		const domain = 'apps::scrapingbee::ScrapingbeeScrapeService::send'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		try {
			this.logger.debug(`[${domain}] Request`, options)
			const response = await this.client.get(options)

			const decoder = new TextDecoder()
			const text = decoder.decode(response.data)

			this.logger.debug(`[${domain}] Response`, text)
			return text
		} catch (e) {
			this.logger.error(`[${domain}] ${e.message}`, options)
		}
	}
}
