import { Api, Env, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
import { ShipbobProductsService } from './products.service'

describe('Shipbob Products Service', () => {
	let moduleRef: TestingModule

	let shipbobProductsService: ShipbobProductsService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [ShipbobProductsService, Api, Logger],
		}).compile()

		shipbobProductsService = moduleRef.get<ShipbobProductsService>(ShipbobProductsService)
	})

	describe('Find All Products', () => {
		it('Able to find all products', async () => {
			const response = await shipbobProductsService.findAll()
			expect(response).toBeDefined()
			expect(response[0]).toBeDefined()
			expect(response[0].id).toBeDefined()
		})
	})
})
