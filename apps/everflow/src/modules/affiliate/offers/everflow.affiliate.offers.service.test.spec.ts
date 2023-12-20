import { Api, Env, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
import { EverflowAffiliateOffersService } from './everflow.affiliate.offers.service'

describe('Affiliate Offers Service', () => {
	let moduleRef: TestingModule

	let everflowAffiliateOffersService: EverflowAffiliateOffersService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				EverflowAffiliateOffersService,
				{
					provide: Api,
					useValue: {
						post: jest.fn(),
					},
				},
				{
					provide: Logger,
					useValue: {
						debug: jest.fn(),
						error: jest.fn(),
					},
				},
			],
		}).compile()

		everflowAffiliateOffersService = moduleRef.get<EverflowAffiliateOffersService>(EverflowAffiliateOffersService)
	})

	describe('Find All Offers', () => {
		it('Able to find all visible offers', async () => {
			const response = await everflowAffiliateOffersService.findAllVisable({
				config: {
					EVERFLOW_API_KEY: 'test',
				},
			})
			expect(response).toBeDefined()
			expect(response[0]).toBeDefined()
			expect(response[0].network_id).toBeDefined()
		})
	})
})
