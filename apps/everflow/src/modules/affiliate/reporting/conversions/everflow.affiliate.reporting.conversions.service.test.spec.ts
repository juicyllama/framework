import { Test, TestingModule } from '@nestjs/testing'
import { Api, Env, Logger } from '@juicyllama/utils'
import { EverflowAffiliateReportingConversionsService } from './everflow.affiliate.reporting.conversions.service'

describe('Affiliate Reporting Conversions Service', () => {
	let moduleRef: TestingModule

	let everflowAffiliateReportingConversionsService: EverflowAffiliateReportingConversionsService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				EverflowAffiliateReportingConversionsService,
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

		everflowAffiliateReportingConversionsService = moduleRef.get<EverflowAffiliateReportingConversionsService>(
			EverflowAffiliateReportingConversionsService,
		)
	})

	describe('Find All Conversions', () => {
		it('Able to find all conversions', async () => {
			const response = await everflowAffiliateReportingConversionsService.findAll({
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
			expect(response[0].conversion_id).toBeDefined()
		})
	})
})
