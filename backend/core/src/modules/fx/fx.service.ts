import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FxRate } from './fx.entity.js'
import { Cache } from 'cache-manager'
import { CachePeriod, Dates, JLCache, Logger, Modules, SupportedCurrencies } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query.js'

const calc = (amount: number, from: number, to: number): number => {
	return (amount / from) * to
}

@Injectable()
export class FxService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<FxRate>,
		@InjectRepository(FxRate) private readonly repository: Repository<FxRate>,
		@Inject(Logger) private readonly logger: Logger,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	/**
	 * Convert amount from one currency to another
	 *
	 * @param amount {int} the amount to convert
	 * @param from {SupportedCurrencies}  the currency you are converting from
	 * @param to {SupportedCurrencies} the currency you are converting to
	 * @param [date] {string} if you want to specify a specific date for the conversion YYYY-MM-DD
	 */

	async convert(amount: number, from: SupportedCurrencies, to: SupportedCurrencies, date?: Date): Promise<number> {
		const domain = 'utils::fx::service::convert'

		if (!date) {
			date = new Date()
		}

		const cache_key = JLCache.cacheKey(domain, {
			date: Dates.format(date, 'YYYY-MM-DD'),
		})

		let rates = <FxRate>await this.cacheManager.get(cache_key)
		if (rates) return calc(amount, rates[from.toString()], rates[to.toString()])

		//get rate based on date from database
		rates = await this.repository.findOne({
			where: {
				date: date,
			},
		})

		if (rates) {
			await this.cacheManager.set(cache_key, rates, CachePeriod.WEEK)
			return calc(amount, rates[from.toString()], rates[to.toString()])
		}

		let fxModule: any

		if (Modules.isInstalled('@juicyllama/apilayer')) {
			//@ts-ignore
			fxModule = require('@juicyllama/apilayer')
			const apilayerCurrencyData = new fxModule.ApilayerCurrencyData()

			const ext_rate = await apilayerCurrencyData.getRate(Dates.format(date, 'YYYY-MM-DD'))

			if (ext_rate && ext_rate.quotes) {
				const create = {
					date: date,
				}

				for (const quote of Object.values(SupportedCurrencies)) {
					create[quote] = ext_rate.quotes['USD' + quote]
				}

				rates = await this.repository.create(create)
				rates = await this.repository.save(rates)
				await this.cacheManager.set(cache_key, rates, CachePeriod.WEEK)
				return calc(amount, rates[from.toString()], rates[to.toString()])
			}
		} else {
			this.logger.error(`[${domain}] No FX App Installed, options are @juicyllama/app-apilayer`)
			throw new Error(`No FX App Installed, options are @juicyllama/app-apilayer`)
		}

		rates = await this.repository.findOne({
			order: { date: 'DESC' },
		})

		if (rates) {
			return calc(amount, rates[from.toString()], rates[to.toString()])
		}

		this.logger.error(`[${domain}] Error converting currency`, {
			from: from,
			to: to,
			amount: amount,
			date: date,
		})
	}
}
