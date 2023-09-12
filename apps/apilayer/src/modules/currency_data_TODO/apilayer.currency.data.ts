import { ApilayerCurrencyDataDto } from './apilayer.currency.data.dto'
import { Api, Enviroment, SupportedCurrencies, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { APILayerConfigDto } from './apilayer.config.dto'
import mock from './apilayer.currency.data.mock'

const logger = new Logger()
const api = new Api()

const schema = Joi.object({
	APILAYER_API_KEY: Joi.string().required(),
	APILAYER_HOST: Joi.string().uri().default('https://api.apilayer.com'),
})

export class ApilayerCurrencyData {
	/**
	 * Historic Exchange Rate
	 *
	 * @param {string} date the date in format YYYY-MM-DD
	 */

	async getRate(date: string): Promise<ApilayerCurrencyDataDto> {
		const domain = 'apps::apilayer::currency_data_TODO::historical'

		const settings = <APILayerConfigDto>await schema.validateAsync({
			APILAYER_API_KEY: process.env.APILAYER_API_KEY,
			APILAYER_HOST: process.env.APILAYER_HOST,
		})

		if ([Enviroment.test].includes(Enviroment[process.env.NODE_ENV])) {
			logger.verbose(`[test::${domain}] Returning mocked result`)
			return mock
		}

		const config = {
			headers: {
				apikey: settings.APILAYER_API_KEY,
			},
		}

		const url = `${settings.APILAYER_HOST}/currency_data/historical?date=${date}&source=${
			SupportedCurrencies.USD
		}&currencies=${Object.values(SupportedCurrencies).toString()}`
		return <ApilayerCurrencyDataDto>await api.get(domain, url, config)
	}
}
