import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { Logger } from '@juicyllama/utils'
import {
	App,
	AppCategory,
	AppInputType,
	AppIntegrationType,
	AppsService,
	AppStoreIntegrationName,
} from '@juicyllama/app-store'

import { GoogleAnalyticsInstallationService } from './google-analytics.installation'

describe('GoogleAnalyticsInstallationService', () => {
	let service: GoogleAnalyticsInstallationService
	let logger: jest.Mocked<Pick<Logger, 'log' | 'error'>>
	let appsService: jest.Mocked<Pick<AppsService, 'findOne' | 'create'>>

	beforeEach(async () => {
		logger = {
			log: jest.fn(),
			error: jest.fn(),
		}
		appsService = {
			findOne: jest.fn(),
			create: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GoogleAnalyticsInstallationService,
				{
					provide: Logger,
					useValue: logger,
				},
				{
					provide: AppsService,
					useValue: appsService,
				},
			],
		}).compile()

		service = module.get<GoogleAnalyticsInstallationService>(GoogleAnalyticsInstallationService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('should do nothing if app aleary exists', async () => {
		appsService.findOne.mockResolvedValue(new App({}))

		await expect(service.onModuleInit()).resolves.toBeUndefined()

		expect(appsService.create).not.toHaveBeenCalled()
	})

	it('should log error message', async () => {
		const mockError = new Error(faker.lorem.words())

		appsService.findOne.mockRejectedValue(mockError)

		await expect(service.onModuleInit()).resolves.toBeUndefined()
		expect(logger.error).toHaveBeenCalledWith(mockError.message, mockError)
	})

	it('should create app if not exists', async () => {
		await expect(service.onModuleInit()).resolves.toBeUndefined()

		expect(logger.log).toHaveBeenCalled()
		expect(appsService.create).toHaveBeenCalledWith({
			name: 'Google Analytics 4',
			url: 'https://analytics.google.com/',
			integration_type: AppIntegrationType.OAUTH2,
			integration_name: AppStoreIntegrationName.ga4,
			category: AppCategory.seo,
			hexcode: '96bf48',
			active: true,
			hidden: false,
			settings: [
				{
					key: 'GOOGLE_ANALYTICS_PROPERTY_ID',
					name: 'Google Analytics Property ID',
					input: {
						type: AppInputType.text,
						required: true,
					},
					description: 'Numeric Property ID at Analytics -> Admin -> Property Details',
					private: false,
				},
			],
		})
	})
})
