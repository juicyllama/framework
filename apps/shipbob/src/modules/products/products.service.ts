import { Api, Logger, Env } from '@juicyllama/utils'
import { Injectable, forwardRef, Inject } from '@nestjs/common'
import { ShipbobConfigDto } from '../../config/shipbob.config.dto'
import { shipbobAxiosConfig } from '../../config/shipbob.config'
import * as mock from './mock.json'
import { ShipbobProduct, ShipbobProductFindParams } from './products.dto'
import { SHIPBOB_URL_PRODUCTS } from './products.constants'

@Injectable()
export class ShipbobProductsService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {}

	async findAll(options?: {
		params?: ShipbobProductFindParams
		config?: ShipbobConfigDto
	}): Promise<ShipbobProduct[]> {
		const domain = 'app::shipbob::products::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return [<any>mock]
		}
		if (!options?.config) throw new Error('Missing config')

		const url = new URL(SHIPBOB_URL_PRODUCTS)
		url.search = new URLSearchParams(<any>options.params).toString()

		const products: ShipbobProduct[] = []
		let page = 1
		const limit = options.params?.Limit ?? 50

		try {
			let results = await this.api.get(domain, url.toString(), shipbobAxiosConfig(options.config))

			products.push(...results)

			this.logger.log(`[${domain}] ${products.length} Products added, fetching next page`)

			while (results.length === limit) {
				page++
				url.searchParams.set('Page', page.toString())
				results = await this.api.get(domain, url.toString(), shipbobAxiosConfig(options.config))
				products.push(...results)
				this.logger.log(`[${domain}] ${products.length} Products added, fetching next page`)
			}

			this.logger.log(`[${domain}] ${products.length} Products found`)

			return products
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding products: ${e.message}`, e)
			throw e
		}
	}
}
