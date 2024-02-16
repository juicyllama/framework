import { Test, TestingModule } from '@nestjs/testing'
import { GoogleAnalyticsOAuthService } from './google-analytics.oauth.service'

describe('AuthService', () => {
	let service: GoogleAnalyticsOAuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GoogleAnalyticsOAuthService],
		}).compile()

		service = module.get<GoogleAnalyticsOAuthService>(GoogleAnalyticsOAuthService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
