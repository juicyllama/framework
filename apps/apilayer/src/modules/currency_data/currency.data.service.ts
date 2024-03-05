import { InjectConfig } from '@juicyllama/core'
import { Api, Env, SupportedCurrencies, Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { ApilayerConfigDto } from '../../config/apilayer.config.dto'
import { CurrencyData } from './currency.data.dto'
import mock from './mock'

const endpoint = 'https://api.apilayer.com/currency_data'

@Injectable()
export class CurrencyDataService {
	constructor(
		private readonly api: Api,
		private readonly logger: Logger,
		@InjectConfig(ApilayerConfigDto) private readonly configService: ApilayerConfigDto,
	) {}

	/**
	 * Historic Exchange Rate
	 *
	 * @param {string} date the date in format YYYY-MM-DD
	 */

	async getRate(date: string): Promise<CurrencyData> {
		const domain = 'apps::apilayer::currency_data::historical'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return mock
		}

		const config = {
			headers: {
				apikey: this.configService.APILAYER_API_KEY,
			},
		}

		const url = `${endpoint}/historical?date=${date}&source=${SupportedCurrencies.USD}&currencies=${Object.values(
			SupportedCurrencies,
		).toString()}`

		return await this.api.get(domain, url, config)
	}
}
