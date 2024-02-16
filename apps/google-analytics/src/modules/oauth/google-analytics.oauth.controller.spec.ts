import { Test, TestingModule } from '@nestjs/testing'
import { GoogleAnalyticsOauthController } from './google-analytics.oauth.controller'

describe('AuthController', () => {
	let controller: GoogleAnalyticsOauthController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GoogleAnalyticsOauthController],
		}).compile()

		controller = module.get<GoogleAnalyticsOauthController>(GoogleAnalyticsOauthController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
