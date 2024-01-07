import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FxRate } from './fx.entity.js'
import { Cache } from 'cache-manager'
import { CachePeriod, Dates, JLCache, Logger, Modules, SupportedCurrencies } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query.js'
import { LazyModuleLoader } from '@nestjs/core'

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
		private readonly lazyModuleLoader: LazyModuleLoader,
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
		const domain = 'core::fx::service::convert'

		if (!amount) {
			this.logger.error(`[${domain}] Amount is required`, {
				amount: amount,
				from: from,
				to: to,
				date: date,
			})
			throw new Error('Amount is required')
		}
		if (!from) {
			this.logger.error(`[${domain}] From is required`, {
				amount: amount,
				from: from,
				to: to,
				date: date,
			})
			throw new Error('From is required')
		}
		if (!to) {
			this.logger.error(`[${domain}] To is required`, {
				amount: amount,
				from: from,
				to: to,
				date: date,
			})
			throw new Error('To is required')
		}

		let convertResult

		if (!date) {
			date = new Date()
		}

		const cache_key = JLCache.cacheKey(domain, {
			date: Dates.format(date, 'YYYY-MM-DD'),
		})

		let rates = <FxRate>await this.cacheManager.get(cache_key)
		if (rates) return calc(amount, rates[from], rates[to])

		//get rate based on date from database
		rates = await this.query.findOne(this.repository, {
			where: {
				date: date,
			},
		})

		if (rates) {
			await this.cacheManager.set(cache_key, rates, CachePeriod.WEEK)
			return calc(amount, rates[from], rates[to])
		}

		if (Modules.datacache.isInstalled) {
			const { DataCacheModule, DataCacheService, Fx } = await Modules.datacache.load()

			try {
				const dataCacheModule = await this.lazyModuleLoader.load(() => DataCacheModule)
				const dataCacheService = dataCacheModule.get(DataCacheService)

				const result = await dataCacheService.get(Fx, {
					date: Dates.format(date, 'YYYY-MM-DD'),
				})

				if (result) {
					rates = await this.query.create(this.repository, result)
					await this.cacheManager.set(cache_key, rates, CachePeriod.WEEK)
					return calc(amount, rates[from], rates[to])
				}
			} catch (e: any) {
				this.logger.error(`[${domain}] ${e.message}`, e)
			}
		}

		if (Modules.apilayer.isInstalled) {
			const { CurrencyDataModule, CurrencyDataService } = await Modules.apilayer.load()
			const currencyDataModule = await this.lazyModuleLoader.load(() => CurrencyDataModule)
			const currencyDataService = currencyDataModule.get(CurrencyDataService)

			const ext_rate = await currencyDataService.getRate(Dates.format(date, 'YYYY-MM-DD'))

			if (ext_rate && ext_rate.quotes) {
				const create = {
					date: date,
				}

				for (const quote of Object.values(SupportedCurrencies)) {
					create[quote] = ext_rate.quotes['USD' + quote]
				}

				rates = await this.query.create(this.repository, create)
				convertResult = calc(amount, rates[from], rates[to])
			} else {
				throw new Error(`[${domain}] Error getting rates from apilayer`)
			}
		} else {
			throw new Error(`[${domain}] No FX App Installed, options are @juicyllama/app-apilayer`)
		}

		if (!convertResult) {
			rates = await this.query.findOne(this.repository, {
				order: { date: 'DESC' },
			})

			if (rates) {
				convertResult = calc(amount, rates[from], rates[to])
			}
		}

		if (convertResult) {
			if (Modules.datacache.isInstalled) {
				const { DataCacheModule, DataCacheService, Fx } = await Modules.datacache.load()

				try {
					const dataCacheModule = await this.lazyModuleLoader.load(() => DataCacheModule)
					const dataCacheService = dataCacheModule.get(DataCacheService)

					await dataCacheService.set(Fx, rates)
				} catch (e: any) {
					this.logger.error(`[${domain}] ${e.message}`, e)
				}
			}

			await this.cacheManager.set(cache_key, rates, CachePeriod.WEEK)
			return convertResult
		}

		this.logger.error(`[${domain}] Error converting currency`, {
			from: from,
			to: to,
			amount: amount,
			date: date,
		})
	}

	/**
	 * Create a new FX rate
	 * @param options
	 */
	async create(fxRate: Partial<FxRate>): Promise<FxRate> {
		return await this.query.create(this.repository, fxRate)
	}
}
