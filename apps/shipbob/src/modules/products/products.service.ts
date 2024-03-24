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
		arguments?: ShipbobProductFindParams
		config?: ShipbobConfigDto
	}): Promise<ShipbobProduct[]> {
		const domain = 'app::shipbob::products::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return [<any>mock]
		}
		if (!options?.config) throw new Error('Missing config')

		try {
			const url = new URL(SHIPBOB_URL_PRODUCTS)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString(), shipbobAxiosConfig(options.config))
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding products: ${e.message}`, e)
			throw e
		}
	}
}
