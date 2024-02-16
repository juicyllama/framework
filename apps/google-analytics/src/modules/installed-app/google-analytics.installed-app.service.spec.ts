import { Test, TestingModule } from '@nestjs/testing'
import { GoogleAnalyticsInstalledAppService } from './google-analytics.installed-app.service'

describe('GoogleAnalyticsInstalledAppService', () => {
	let service: GoogleAnalyticsInstalledAppService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [GoogleAnalyticsInstalledAppService],
		}).compile()

		service = module.get<GoogleAnalyticsInstalledAppService>(GoogleAnalyticsInstalledAppService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
