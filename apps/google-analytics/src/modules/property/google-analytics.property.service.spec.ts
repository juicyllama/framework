import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { createMockGoogleCredentials } from '../../mocks'

import { BetaAnalyticsDataClient } from '@google-analytics/data'

import { GoogleAnalyticsOAuthService } from '../oauth/google-analytics.oauth.service'
import { GoogleAnalyticsInstalledAppOAuthService } from '../oauth/google-analytics.installed-app-oauth.service'

import { GoogleAnalyticsPropertyService } from './google-analytics.property.service'
import { GoogleAnalyticsInstalledApp } from './google-analytics.installed-app.entity'

jest.mock('@google-analytics/data')

describe('GoogleAnalyticsPropertyService', () => {
	let service: GoogleAnalyticsPropertyService
	let googleAnalyticsOAuthService: jest.Mocked<
		Pick<GoogleAnalyticsOAuthService, 'getAuthenticatedClient' | 'createDataClientCredentials'>
	>
	let googleAnalyticsInstalledAppOAuthService: jest.Mocked<
		Pick<GoogleAnalyticsInstalledAppOAuthService, 'loadSavedCredentials'>
	>

	beforeEach(async () => {
		googleAnalyticsOAuthService = { getAuthenticatedClient: jest.fn(), createDataClientCredentials: jest.fn() }
		googleAnalyticsInstalledAppOAuthService = { loadSavedCredentials: jest.fn() }

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GoogleAnalyticsPropertyService,
				{ provide: GoogleAnalyticsOAuthService, useValue: googleAnalyticsOAuthService },
				{ provide: GoogleAnalyticsInstalledAppOAuthService, useValue: googleAnalyticsInstalledAppOAuthService },
			],
		}).compile()

		service = module.get<GoogleAnalyticsPropertyService>(GoogleAnalyticsPropertyService)
	})

	describe('runReport', () => {
		it('should hit Google runReport', async () => {
			const mockPayload = {
				metrics: [
					{
						name: 'activeUsers',
					},
				],
			}
			const mockResponse = {}
			const mockInstalledApp = new GoogleAnalyticsInstalledApp({
				settings: { GOOGLE_ANALYTICS_PROPERTY_ID: faker.number.int() },
			})

			const mockTokens = createMockGoogleCredentials()
			const mockOauth2Client = { id: 'mockOauth2Client' } as any
			const mockCredentials = { id: 'mockCredentials' } as any
			googleAnalyticsInstalledAppOAuthService.loadSavedCredentials.mockResolvedValue(mockTokens)
			googleAnalyticsOAuthService.getAuthenticatedClient.mockReturnValue(mockOauth2Client)
			googleAnalyticsOAuthService.createDataClientCredentials.mockReturnValue(mockCredentials)
			;(BetaAnalyticsDataClient.prototype.runReport as jest.Mock).mockResolvedValue([mockResponse])

			await expect(service.runReport(mockInstalledApp, mockPayload)).resolves.toBe(mockResponse)
			expect(googleAnalyticsInstalledAppOAuthService.loadSavedCredentials).toHaveBeenCalledWith(mockInstalledApp)
			expect(googleAnalyticsOAuthService.getAuthenticatedClient).toHaveBeenCalledWith(mockTokens)
			expect(googleAnalyticsOAuthService.createDataClientCredentials).toHaveBeenCalledWith(mockOauth2Client)
			expect(BetaAnalyticsDataClient).toHaveBeenCalledWith({ sslCreds: mockCredentials })

			expect(BetaAnalyticsDataClient.prototype.runReport).toHaveBeenCalledWith({
				...mockPayload,
				property: expect.stringContaining(mockInstalledApp.settings.GOOGLE_ANALYTICS_PROPERTY_ID.toString()),
			})
		})
	})
})
