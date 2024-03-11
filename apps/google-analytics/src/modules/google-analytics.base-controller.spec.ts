import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { BadRequestException, Controller, NotFoundException } from '@nestjs/common'

import { GoogleAnalyticsBaseController } from './google-analytics.base-controller'
import { GoogleAnalyticsInstalledAppService } from './installed-app/google-analytics.installed-app.service'
import { GoogleAnalyticsInstalledApp } from './property/google-analytics.installed-app.entity'

// @ts-ignore
@Controller()
class GoogleAnalyticsBaseControllerDummyChild extends GoogleAnalyticsBaseController {
	public constructor(gaInstalledAppService: GoogleAnalyticsInstalledAppService) {
		super(gaInstalledAppService)
	}

	action(id: number, accountId: number) {
		return this.loadInstalledApp(id, accountId)
	}
}

describe('PropertyController', () => {
	let controller: GoogleAnalyticsBaseControllerDummyChild
	let gaInstalledAppService: jest.Mocked<Pick<GoogleAnalyticsInstalledAppService, 'load'>>

	beforeEach(async () => {
		gaInstalledAppService = { load: jest.fn() }

		const module: TestingModule = await Test.createTestingModule({
			providers: [{ provide: GoogleAnalyticsInstalledAppService, useValue: gaInstalledAppService }],
			controllers: [GoogleAnalyticsBaseControllerDummyChild],
		}).compile()

		controller = module.get<GoogleAnalyticsBaseControllerDummyChild>(GoogleAnalyticsBaseControllerDummyChild)
	})

	describe('loadInstalledApp', () => {
		const mockId = faker.number.int()
		const mockAccountId = faker.number.int()

		it('should handle known errors', async () => {
			gaInstalledAppService.load.mockRejectedValue(new GoogleAnalyticsInstalledAppService.AppNotFoundException())

			await expect(controller.action(mockId, mockAccountId)).rejects.toBeInstanceOf(NotFoundException)

			const mockProperty = faker.word.noun()

			gaInstalledAppService.load.mockRejectedValue(
				new GoogleAnalyticsInstalledAppService.AppNotConfiguredException(mockProperty),
			)
			await expect(controller.action(mockId, mockAccountId)).rejects.toBeInstanceOf(BadRequestException)
			await expect(controller.action(mockId, mockAccountId)).rejects.toThrow(mockProperty)
		})

		it('should rethrow unknown error', async () => {
			const mockError = new Error(faker.lorem.words())

			gaInstalledAppService.load.mockRejectedValue(mockError)

			await expect(controller.action(mockId, mockAccountId)).rejects.toBe(mockError)
		})

		it('should return loaded app', async () => {
			const mockApp = new GoogleAnalyticsInstalledApp({})
			gaInstalledAppService.load.mockResolvedValue(mockApp)

			await expect(controller.action(mockId, mockAccountId)).resolves.toBe(mockApp)
		})
	})
})
