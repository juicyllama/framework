import { Test, TestingModule } from '@nestjs/testing'
import { Api, Env, Logger } from '@juicyllama/utils'
import { EverflowAffiliateReportingClicksService } from './everflow.affiliate.reporting.clicks.service'

describe('Affiliate Reporting Clicks Service', () => {
	let moduleRef: TestingModule

	let everflowAffiliateReportingClicksService: EverflowAffiliateReportingClicksService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				EverflowAffiliateReportingClicksService,
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

		everflowAffiliateReportingClicksService = moduleRef.get<EverflowAffiliateReportingClicksService>(
			EverflowAffiliateReportingClicksService,
		)
	})

	describe('Find All Clicks', () => {
		it('Able to find all clicks', async () => {
			const response = await everflowAffiliateReportingClicksService.findAll({
				arguments: {
					from: '2000-01-01 00:00:00',
					to: '2000-01-01 23:59:59',
				},
				config: {
					EVERFLOW_API_KEY: 'test',
				},
			})
			expect(response).toBeDefined()
			expect(response[0]).toBeDefined()
			expect(response[0].transaction_id).toBeDefined()
		})
	})
})
