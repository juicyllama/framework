import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { AppIntegrationStatus, InstalledAppsService } from '@juicyllama/app-store'

import { GoogleAnalyticsInstalledAppService } from './google-analytics.installed-app.service'
import { GoogleAnalyticsInstalledApp } from '../property/google-analytics.installed-app.entity'

describe('GoogleAnalyticsInstalledAppService', () => {
	let service: GoogleAnalyticsInstalledAppService
	let installedAppsService: jest.Mocked<Pick<InstalledAppsService, 'findOne' | 'update'>>

	beforeEach(async () => {
		installedAppsService = {
			findOne: jest.fn(),
			update: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GoogleAnalyticsInstalledAppService,
				{
					provide: InstalledAppsService,
					useValue: installedAppsService,
				},
			],
		}).compile()

		service = module.get<GoogleAnalyticsInstalledAppService>(GoogleAnalyticsInstalledAppService)
	})

	describe('load', () => {
		const mockId = faker.number.int()
		const mockAccountId = faker.number.int()

		it('should throw validation error if not found', async () => {
			await expect(service.load(mockId, mockAccountId)).rejects.toBeInstanceOf(
				GoogleAnalyticsInstalledAppService.AppNotFoundException,
			)
		})

		it('should throw validation error if not configured', async () => {
			const mockApp = new GoogleAnalyticsInstalledApp({ settings: {} })
			installedAppsService.findOne.mockResolvedValue(mockApp)

			await expect(service.load(mockId, mockAccountId)).rejects.toBeInstanceOf(
				GoogleAnalyticsInstalledAppService.AppNotConfiguredException,
			)
		})

		it('should return app from the repository', async () => {
			const mockApp = new GoogleAnalyticsInstalledApp({
				settings: { GOOGLE_ANALYTICS_PROPERTY_ID: faker.number.int() },
			})
			installedAppsService.findOne.mockResolvedValue(mockApp)

			await expect(service.load(mockId, mockAccountId)).resolves.toBe(mockApp)
		})
	})

	describe('recordConnected', () => {
		const mockInstalledApp = { installed_app_id: faker.number.int() }

		it('should store integration status', async () => {
			await expect(service.recordConnected(mockInstalledApp)).resolves.toBeUndefined()
			expect(installedAppsService.update).toHaveBeenCalledWith({
				...mockInstalledApp,
				integration_status: AppIntegrationStatus.CONNECTED,
			})
		})
	})
})
