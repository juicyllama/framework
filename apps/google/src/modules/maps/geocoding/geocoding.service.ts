import { Client } from '@googlemaps/google-maps-services-js'
import { InjectConfig, MONGODB, Query } from '@juicyllama/core'
import { Logger, Env } from '@juicyllama/utils'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GoogleConfigDto } from '../../../config/google.config.dto'
import { InjectGoogleMaps } from './geocoding.constants'
import { GoogleMapsGeocoding } from './geocoding.entity.mongo'
import { googleGeocodeToEntity } from './geocoding.mapper'
import * as mock from './mock.json'

type GEOCODING_T = GoogleMapsGeocoding

@Injectable()
export class GeocodingService {
	constructor(
		private readonly logger: Logger,
		@Inject(Query)
		private readonly query: Query<GEOCODING_T>,
		@InjectRepository(GoogleMapsGeocoding, MONGODB) private readonly repository: Repository<GEOCODING_T>,
		@InjectConfig(GoogleConfigDto) private readonly config: GoogleConfigDto,
		@InjectGoogleMaps() private readonly client: Client,
	) {}

	async findByAddress(search: string): Promise<GEOCODING_T> {
		const domain = 'app::google::maps::geocoding::address'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return googleGeocodeToEntity(search, <any>mock)
		}

		const result = await this.query.findOne(this.repository, {
			where: {
				search: search,
			},
		})

		if (result) {
			const cachedDate = new Date()
			cachedDate.setDate(cachedDate.getDate() - 365)

			// if the number is cached and is not older than cachedDate
			if (result.created_at && cachedDate < result.created_at) {
				this.logger.debug(`[${domain}] Result found in the data lake`)
				return result
			}
		}

		this.logger.debug(`[${domain}] Result not found in the data lake or is outdated, calling API`)

		const args = {
			params: {
				key: this.config.GOOGLE_MAPS_API_KEY,
				address: search,
			},
		}
		const response = await this.client.geocode(args)

		const geocoding = googleGeocodeToEntity(search, response.data.results[0])

		this.logger.debug(`[${domain}] Adding result into the data lake, calling API`, geocoding)

		return await this.query.create(this.repository, geocoding)
	}
}
