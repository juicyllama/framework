import { Api, Env, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
import { ShipbobLocationsService } from './locations.service'

describe('Shipbob Locations Service', () => {
	let moduleRef: TestingModule

	let shipbobLocationsService: ShipbobLocationsService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [ShipbobLocationsService, Api, Logger],
		}).compile()

		shipbobLocationsService = moduleRef.get<ShipbobLocationsService>(ShipbobLocationsService)
	})

	// describe('Create Post', () => {
	// 	it('Able to create a post', async () => {
	// 		const response = await wordpressPostsService.create({
	// 			data: <any>mock,
	// 		})
	// 		expect(response).toBeDefined()
	// 		expect(response.id).toBeDefined()
	// 		expect(response.title.rendered).toEqual('Example post')
	// 	})
	// })

	describe('Find All Locations', () => {
		it('Able to find all locations', async () => {
			const response = await shipbobLocationsService.findAll()
			expect(response).toBeDefined()
			expect(response[0]).toBeDefined()
			expect(response[0].id).toBeDefined()
		})
	})

	// describe('Find One Post', () => {
	// 	it('Able to find a post', async () => {
	// 		const response = await wordpressPostsService.findOne({
	// 			postId: mock.id,
	// 		})
	// 		expect(response).toBeDefined()
	// 		expect(response.id).toBeDefined()
	// 		expect(response.title.rendered).toEqual('Example post')
	// 	})
	// })
})
