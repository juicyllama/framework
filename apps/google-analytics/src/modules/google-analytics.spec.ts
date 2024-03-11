import { Test, TestingModule } from '@nestjs/testing'

import { GoogleAnalyticsModule } from './google-analytics.module'
import { GoogleAnalyticsInstallationService } from './google-analytics.installation'

jest.mock('@juicyllama/app-store', () => ({ AppsModule: class {} }))
jest.mock('@juicyllama/utils', () => ({ Logger: class {} }))

jest.mock('./google-analytics.installation', () => ({ GoogleAnalyticsInstallationService: class {} }))
jest.mock('./config/google-analytics.config.module', () => ({ GoogleAnalyticsConfigModule: class {} }))
jest.mock('./oauth/google-analytics.oauth.module', () => ({ GoogleAnalyticsOAuthModule: class {} }))
jest.mock('./property/google-analytics.property.module', () => ({ GoogleAnalyticsPropertyModule: class {} }))

describe('Google Analytics', () => {
	let moduleRef: TestingModule

	beforeAll(async () => {
		moduleRef = await Test.createTestingModule({
			imports: [GoogleAnalyticsModule.forRoot()],
		}).compile()
	})

	it('should allow for the use of the GoogleAnalyticsModule', () => {
		expect(moduleRef.get(GoogleAnalyticsInstallationService, { strict: false })).toBeDefined()
	})
})
