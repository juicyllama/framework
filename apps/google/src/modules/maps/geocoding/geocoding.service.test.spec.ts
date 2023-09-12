import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Env, Logger, Api } from '@juicyllama/utils'
import { MONGODB, mongodbConfig, Query } from '@juicyllama/core'
import { GeocodingService } from './geocoding.service'
import googleConfig from '../../../config/google.config'
import { GoogleMapsGeocoding } from './geocoding.entity.mongo'

describe('Geocoding Service', () => {
	let moduleRef: TestingModule

	let geocodingService: GeocodingService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					load: [mongodbConfig, googleConfig],
				}),
				TypeOrmModule.forRootAsync(mongodbConfig()),
				TypeOrmModule.forFeature([GoogleMapsGeocoding], MONGODB),
			],
			providers: [GeocodingService, Logger, Query, Api],
		}).compile()

		geocodingService = moduleRef.get<GeocodingService>(GeocodingService)
	})

	describe('Get Geocode By Address', () => {
		it('Valid response by search', async () => {
			const response = await geocodingService.findByAddress('London Heathrow Airport, London, GB')
			expect(response).toBeDefined()
			expect(response.search).toEqual('London Heathrow Airport, London, GB')
			expect(response.place_id).toBeDefined()
		})
	})
})
