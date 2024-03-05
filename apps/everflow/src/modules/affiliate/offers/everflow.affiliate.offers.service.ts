import { Api, Env, Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { getEverflowAxiosConfig } from '../../../config/everflow.config'
import { EverflowConfigDto } from '../../../config/everflow.config.dto'
import { EverflowOffer } from '../../../types/offer/offer.dto'
import * as mock from '../../../types/offer/offers.mock.json'

const ENDPOINT = `https://api.eflow.team/v1/affiliates/alloffers`

@Injectable()
export class EverflowAffiliateOffersService {
	constructor(
		private readonly api: Api,
		private readonly logger: Logger,
	) {}

	async findAllVisable(options: { config: EverflowConfigDto }): Promise<EverflowOffer[]> {
		const domain = 'app::everflow::affiliate::offers::findAllVisable'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return mock.offers
		}

		try {
			return await this.api.get(domain, ENDPOINT, getEverflowAxiosConfig(options.config))
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding offers: ${e.message}`, e)
			throw e
		}
	}
}
