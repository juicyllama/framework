import { Client } from '@googlemaps/google-maps-services-js'
import { InjectConfig, MONGODB, Query } from '@juicyllama/core'
import { Logger, Env } from '@juicyllama/utils'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GoogleConfigDto } from '../../../config/google.config.dto'
import { InjectGoogleMaps } from '../provider'
import * as mock from './mock.json'
import { GoogleMapsPlace } from './places.entity.mongo'
import { googlePlaceDetailsToEntity } from './places.mapper'

type PLACES_T = GoogleMapsPlace
const CACHE_DAYS = 3

@Injectable()
export class PlacesService {
	constructor(
		private readonly logger: Logger,
		@Inject(Query) private readonly query: Query<PLACES_T>,
		@InjectRepository(GoogleMapsPlace, MONGODB) private readonly repository: Repository<PLACES_T>,
		@InjectConfig(GoogleConfigDto) private readonly config: GoogleConfigDto,
		@InjectGoogleMaps() private readonly client: Client,
	) {}

	async getPlaceById(place_id: string): Promise<PLACES_T> {
		const domain = 'app::google::maps::places::getPlaceById'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return googlePlaceDetailsToEntity(<any>mock)
		}

		const result = await this.query.findOne(this.repository, {
			where: {
				place_id: place_id,
			},
		})

		if (result) {
			const cachedDate = new Date()
			cachedDate.setDate(cachedDate.getDate() - CACHE_DAYS)

			// if the number is cached and is not older than cachedDate
			if (cachedDate < result.created_at) {
				this.logger.debug(`[${domain}] Result found in the data lake`)
				return result
			}
		}

		this.logger.debug(`[${domain}] Result not found in the data lake or is outdated, calling API`)

		const args = {
			params: {
				key: this.config.GOOGLE_MAPS_API_KEY,
				place_id: place_id,
			},
		}
		const response = await this.client.placeDetails(args)

		const place = googlePlaceDetailsToEntity(response.data.result)

		this.logger.debug(`[${domain}] Adding result into the data lake, calling API`, place)

		if (result && place) {
			await this.query.purge(this.repository, result)
		}
		return await this.query.create(this.repository, place)
	}
}
