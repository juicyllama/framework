import { Api, Logger, Env } from '@juicyllama/utils'
import { Injectable, forwardRef, Inject } from '@nestjs/common'
import { ShipbobConfigDto } from '../../config/shipbob.config.dto'
import { shipbobAxiosConfig } from '../../config/shipbob.config'
import * as mock from './mock.json'
import { ShipbobLocation, ShipbobLocationFindParams } from './locations.dto'
import { SHIPBOB_URL_LOCATION } from './locations.constants'

@Injectable()
export class ShipbobLocationsService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {}

	async findAll(options?: {
		params?: ShipbobLocationFindParams
		config?: ShipbobConfigDto
	}): Promise<ShipbobLocation[]> {
		const domain = 'app::shipbob::locations::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return [<any>mock]
		}
		if (!options?.config) throw new Error('Missing config')

		try {
			const url = new URL(SHIPBOB_URL_LOCATION)
			url.search = new URLSearchParams(<any>options.params).toString()
			return await this.api.get(domain, url.toString(), shipbobAxiosConfig(options.config))
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding locations: ${e.message}`, e)
			throw e
		}
	}
}
