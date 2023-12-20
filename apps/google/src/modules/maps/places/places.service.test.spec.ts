import { getConfigToken, MONGODB, Query } from '@juicyllama/core'
import { Env, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { GoogleConfigDto } from '../../../config/google.config.dto'
import { GoogleMapsClientToken } from '../provider'
import { GoogleMapsPlace } from './places.entity.mongo'
import { PlacesService } from './places.service'

describe('Places Service', () => {
	let moduleRef: TestingModule

	let service: PlacesService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				PlacesService,
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
					provide: getRepositoryToken(GoogleMapsPlace, MONGODB),
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

		service = moduleRef.get<PlacesService>(PlacesService)
	})

	describe('Get Place By PlaceId', () => {
		it('Valid response by PlaceId', async () => {
			const response = await service.getPlaceById('London Heathrow Airport, London, GB')
			expect(response).toBeDefined()
			expect(response.place_id).toBeDefined()
			expect(response.vicinity).toEqual('Langford Lane, Kidlington')
		})
	})
})
