import { Test, TestingModule } from '@nestjs/testing'
import { Env } from '@juicyllama/utils'
import { EverflowAffiliateReportingConversionsService } from './everflow.affiliate.reporting.conversions.service'
import { EverflowAffiliateReportingConversionsModule } from './everflow.affiliate.reporting.conversions.module'
import { forwardRef } from '@nestjs/common'

describe('Affiliate Reporting Conversions Service', () => {
	let moduleRef: TestingModule

	let everflowAffiliateReportingConversionsService: EverflowAffiliateReportingConversionsService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [forwardRef(() => EverflowAffiliateReportingConversionsModule)],
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
