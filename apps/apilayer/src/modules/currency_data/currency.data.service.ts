import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CurrencyData } from './currency.data.dto'
import { Api, Env, SupportedCurrencies, Logger } from '@juicyllama/utils'
import mock from './mock'

const endpoint = 'https://api.apilayer.com/currency_data'

@Injectable()
export class CurrencyDataService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
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
				apikey: this.configService.get<string>('apilayer.apikey'),
			},
		}

		const url = `${endpoint}/historical?date=${date}&source=${SupportedCurrencies.USD}&currencies=${Object.values(
			SupportedCurrencies,
		).toString()}`

		return await this.api.get(domain, url, config)
	}
}
