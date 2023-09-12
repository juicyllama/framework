import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger, Env, Api } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { SpbConfig } from 'scrapingbee/src'
import { ScrapingBeeClient } from 'scrapingbee'

@Injectable()
export class ScrapingBeeScrapeService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	async scrape(options: SpbConfig): Promise<any> {
		const domain = 'apps::scrapingbee::ScrapingbeeScrapeService::send'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		try {
			const client = new ScrapingBeeClient(this.configService.get('scrapingbee.SCRAPINGBEE_API_KEY'))
			this.logger.debug(`[${domain}] Request`, options)
			const response = await client.get(options)

			const decoder = new TextDecoder()
			const text = decoder.decode(response.data)

			this.logger.debug(`[${domain}] Response`, text)
			return text
		} catch (e) {
			this.logger.error(`[${domain}] ${e.message}`, options)
		}
	}
}
