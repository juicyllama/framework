import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Api, Logger, Env } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { MONGODB, Query } from '@juicyllama/core'
import { GoogleMapsPlace } from './places.entity.mongo'
import * as mock from './mock.json'
import { googlePlaceDetailsToEntity } from './places.mapper'
import { Client } from '@googlemaps/google-maps-services-js'

type PLACES_T = GoogleMapsPlace

@Injectable()
export class PlacesService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Query)) private readonly query: Query<PLACES_T>,
		@InjectRepository(GoogleMapsPlace, MONGODB) private readonly repository: Repository<PLACES_T>,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
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
				place_id: place_id,
			},
		}
		const client = new Client()
		const response = await client.placeDetails(args)

		const place = googlePlaceDetailsToEntity(response.data.result)

		this.logger.debug(`[${domain}] Adding result into the data lake, calling API`, place)

		return await this.query.create(this.repository, place)
	}
}
