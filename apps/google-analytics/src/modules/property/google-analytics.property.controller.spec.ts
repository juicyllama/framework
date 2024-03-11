import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { GoogleAnalyticsInstalledAppService } from '../installed-app/google-analytics.installed-app.service'

import { GoogleAnalyticsPropertyController } from './google-analytics.property.controller'
import { GoogleAnalyticsPropertyService } from './google-analytics.property.service'
import { GoogleAnalyticsInstalledApp } from './google-analytics.installed-app.entity'

describe('GoogleAnalyticsPropertyController', () => {
	let controller: GoogleAnalyticsPropertyController
	let gaInstalledAppService: jest.Mocked<Pick<GoogleAnalyticsInstalledAppService, 'load'>>
	let propertyService: jest.Mocked<Pick<GoogleAnalyticsPropertyService, 'runReport'>>

	beforeEach(async () => {
		gaInstalledAppService = { load: jest.fn() }
		propertyService = { runReport: jest.fn() }

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{ provide: GoogleAnalyticsInstalledAppService, useValue: gaInstalledAppService },
				{ provide: GoogleAnalyticsPropertyService, useValue: propertyService },
			],
			controllers: [GoogleAnalyticsPropertyController],
		}).compile()

		controller = module.get<GoogleAnalyticsPropertyController>(GoogleAnalyticsPropertyController)
	})

	describe('runReport', () => {
		it('should process request and return data from the service', async () => {
			const mockAccountId = faker.number.int()
			const mockInstalledAppId = faker.number.int()
			const mockPayload = {
				metrics: [
					{
						name: 'activeUsers',
					},
				],
			}
			const mockResponse = {}
			const mockApp = new GoogleAnalyticsInstalledApp({})

			gaInstalledAppService.load.mockResolvedValue(mockApp)
			propertyService.runReport.mockResolvedValue(mockResponse)

			await expect(controller.runReport(mockAccountId, mockInstalledAppId, mockPayload)).resolves.toBe(
				mockResponse,
			)

			expect(gaInstalledAppService.load).toHaveBeenCalledWith(mockInstalledAppId, mockAccountId)
			expect(propertyService.runReport).toHaveBeenCalledWith(mockApp, mockPayload)
		})
	})
})
