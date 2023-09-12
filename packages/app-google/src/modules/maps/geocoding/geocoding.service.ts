import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Api, Logger, Env } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { MONGODB, Query } from '@juicyllama/core'
import { GoogleMapsGeocoding } from './geocoding.entity.mongo'
import * as mock from './mock.json'
import { googleGeocodeToEntity } from './geocoding.mapper'
import { Client } from '@googlemaps/google-maps-services-js'

type GEOCODING_T = GoogleMapsGeocoding

@Injectable()
export class GeocodingService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Query)) private readonly query: Query<GEOCODING_T>,
		@InjectRepository(GoogleMapsGeocoding, MONGODB) private readonly repository: Repository<GEOCODING_T>,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
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
			if (cachedDate < result.created_at) {
				this.logger.debug(`[${domain}] Result found in the data lake`)
				return result
			}
		}

		this.logger.debug(`[${domain}] Result not found in the data lake or is outdated, calling API`)

		const args = {
			params: {
				key: this.configService.get('google.GOOGLE_MAPS_API_KEY'),
				address: search,
			},
		}
		const client = new Client()
		const response = await client.geocode(args)

		const geocoding = googleGeocodeToEntity(search, response.data.results[0])

		this.logger.debug(`[${domain}] Adding result into the data lake, calling API`, geocoding)

		return await this.query.create(this.repository, geocoding)
	}
}
