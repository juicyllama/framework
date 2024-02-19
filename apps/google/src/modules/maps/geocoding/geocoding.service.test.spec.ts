import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Env, Logger } from '@juicyllama/utils'
import { MONGODB, Query, getConfigToken } from '@juicyllama/core'
import { GoogleConfigDto } from '../../../config/google.config.dto'
import { GoogleMapsClientToken } from '../provider'
import { GeocodingService } from './geocoding.service'
import { GoogleMapsGeocoding } from './geocoding.entity.mongo'

describe('Geocoding Service', () => {
	let moduleRef: TestingModule

	let geocodingService: GeocodingService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				GeocodingService,
				{
					provide: Logger,
					useValue: {
						debug: jest.fn(),
						error: jest.fn(),
					},
				},
				{
					provide: Query,
					useValue: {
						findOne: jest.fn(),
						create: jest.fn(),
					},
				},
				{
					provide: getRepositoryToken(GoogleMapsGeocoding, MONGODB),
					useValue: {},
				},
				{
					provide: getConfigToken(GoogleConfigDto),
					useValue: {
						GOOGLE_MAPS_API_KEY: '',
					},
				},
				{
					provide: GoogleMapsClientToken,
					useValue: {
						geocode: jest.fn(),
					},
				},
			],
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
