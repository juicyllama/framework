import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { Env } from '@juicyllama/utils'

import { GoogleAnalyticsModule } from './google-analytics.module'
import { GoogleAnalyticsInstallationService } from './google-analytics.installation'

describe('Google Analytics', () => {
	let moduleRef: TestingModule

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
				}),
				GoogleAnalyticsModule,
			],
		}).compile()
	}, 180000)
	it('should allow for the use of the GoogleAnalytics4Module', () => {
		expect(moduleRef.get(GoogleAnalyticsInstallationService, { strict: false })).toBeDefined()
	})
})
