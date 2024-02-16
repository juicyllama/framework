import { Test, TestingModule } from '@nestjs/testing'
import { GoogleAnalyticsPropertyController } from './google-analytics.property.controller'

describe('PropertyController', () => {
	let controller: GoogleAnalyticsPropertyController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GoogleAnalyticsPropertyController],
		}).compile()

		controller = module.get<GoogleAnalyticsPropertyController>(GoogleAnalyticsPropertyController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
