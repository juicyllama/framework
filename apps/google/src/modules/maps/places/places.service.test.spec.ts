import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Env, Logger, Api } from '@juicyllama/utils'
import { MONGODB, mongodbConfig, Query } from '@juicyllama/core'
import { PlacesService } from './places.service'
import googleConfig from '../../../config/google.config'
import { GoogleMapsPlace } from './places.entity.mongo'

describe('Places Service', () => {
	let moduleRef: TestingModule

	let service: PlacesService

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
				TypeOrmModule.forFeature([GoogleMapsPlace], MONGODB),
			],
			providers: [PlacesService, Logger, Query, Api],
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
