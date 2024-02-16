import { Test, TestingModule } from '@nestjs/testing'
import { GoogleAnalyticsPropertyService } from './google-analytics.property.service'

describe('PropertyService', () => {
	let service: GoogleAnalyticsPropertyService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GoogleAnalyticsPropertyService],
		}).compile()

		service = module.get<GoogleAnalyticsPropertyService>(GoogleAnalyticsPropertyService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
