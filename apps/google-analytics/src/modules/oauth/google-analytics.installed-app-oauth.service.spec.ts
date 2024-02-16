import { Test, TestingModule } from '@nestjs/testing'
import { GoogleAnalyticsInstalledAppOAuthService } from './google-analytics.installed-app-oauth.service'

describe('InstalledAppAuthService', () => {
	let service: GoogleAnalyticsInstalledAppOAuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GoogleAnalyticsInstalledAppOAuthService],
		}).compile()

		service = module.get<GoogleAnalyticsInstalledAppOAuthService>(GoogleAnalyticsInstalledAppOAuthService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
