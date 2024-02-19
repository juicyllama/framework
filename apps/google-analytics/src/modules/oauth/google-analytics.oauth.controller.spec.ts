import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { createMockGoogleCredentials, createMockInstalledAppLocator } from '../../mocks'

import { BadRequestException } from '@nestjs/common'

import { Oauth } from '@juicyllama/app-store'

import { GoogleAnalyticsInstalledApp } from '../property/google-analytics.installed-app.entity'
import { GoogleAnalyticsInstalledAppService } from '../installed-app/google-analytics.installed-app.service'

import { GoogleAnalyticsOAuthController } from './google-analytics.oauth.controller'
import { GoogleAnalyticsOAuthService } from './google-analytics.oauth.service'
import { GoogleAnalyticsInstalledAppOAuthService } from './google-analytics.installed-app-oauth.service'

describe('AuthController', () => {
	let controller: GoogleAnalyticsOAuthController
	let gaInstalledAppService: jest.Mocked<Pick<GoogleAnalyticsInstalledAppService, 'recordConnected' | 'load'>>
	let googleAnalyticsOAuthService: jest.Mocked<
		Pick<GoogleAnalyticsOAuthService, 'generateAuthUrl' | 'getTokensFromCallbackCode'>
	>
	let googleAnalyticsInstalledAppOAuthService: jest.Mocked<
		Pick<GoogleAnalyticsInstalledAppOAuthService, 'initOauth' | 'storeOauth'>
	>

	beforeEach(async () => {
		gaInstalledAppService = {
			load: jest.fn(),
			recordConnected: jest.fn(),
		}
		googleAnalyticsOAuthService = {
			generateAuthUrl: jest.fn(),
			getTokensFromCallbackCode: jest.fn(),
		}

		googleAnalyticsInstalledAppOAuthService = {
			initOauth: jest.fn(),
			storeOauth: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{ provide: GoogleAnalyticsInstalledAppService, useValue: gaInstalledAppService },
				{ provide: GoogleAnalyticsOAuthService, useValue: googleAnalyticsOAuthService },
				{ provide: GoogleAnalyticsInstalledAppOAuthService, useValue: googleAnalyticsInstalledAppOAuthService },
			],
			controllers: [GoogleAnalyticsOAuthController],
		}).compile()

		controller = module.get<GoogleAnalyticsOAuthController>(GoogleAnalyticsOAuthController)
	})

	describe('init', () => {
		const mockInstalledApp = new GoogleAnalyticsInstalledApp(createMockInstalledAppLocator())
		const mockAccountId = faker.number.int()

		const mockOauthStarter = {
			state: faker.string.uuid(),
			authUrl: faker.internet.url(),
		}

		it('should initiate oauth flow and return redirect URL', async () => {
			googleAnalyticsOAuthService.generateAuthUrl.mockReturnValue(mockOauthStarter)
			gaInstalledAppService.load.mockResolvedValue(mockInstalledApp)

			await expect(controller.init(mockInstalledApp.installed_app_id, mockAccountId)).resolves.toEqual({
				redirect_url: mockOauthStarter.authUrl,
			})

			expect(googleAnalyticsOAuthService.generateAuthUrl).toHaveBeenCalled()
			expect(gaInstalledAppService.load).toHaveBeenCalledWith(mockInstalledApp.installed_app_id, mockAccountId)
			expect(googleAnalyticsInstalledAppOAuthService.initOauth).toHaveBeenCalledWith(
				mockInstalledApp,
				mockOauthStarter,
			)
		})
	})

	describe('callback', () => {
		const mockState = faker.string.uuid()
		const mockCode = faker.string.hexadecimal()
		const mockCredentials = createMockGoogleCredentials()
		const mockOauth = new Oauth(createMockInstalledAppLocator())

		it('should handle missing oauth record', async () => {
			googleAnalyticsInstalledAppOAuthService.storeOauth.mockRejectedValue(
				new GoogleAnalyticsInstalledAppOAuthService.OAuthNotFoundException(),
			)

			await expect(controller.callback(mockState, mockCode)).rejects.toBeInstanceOf(BadRequestException)
		})

		it('should rethrow unknown error', async () => {
			const mockError = new Error(faker.lorem.words())

			googleAnalyticsOAuthService.getTokensFromCallbackCode.mockRejectedValue(mockError)

			await expect(controller.callback(mockState, mockCode)).rejects.toBe(mockError)
		})

		it('should process callback params', async () => {
			googleAnalyticsOAuthService.getTokensFromCallbackCode.mockResolvedValue(mockCredentials)
			googleAnalyticsInstalledAppOAuthService.storeOauth.mockResolvedValue(mockOauth)

			await expect(controller.callback(mockState, mockCode)).resolves.toEqual({ success: true })
			expect(googleAnalyticsOAuthService.getTokensFromCallbackCode).toHaveBeenCalledWith(mockCode)
			expect(googleAnalyticsInstalledAppOAuthService.storeOauth).toHaveBeenCalledWith(mockState, mockCredentials)
			expect(gaInstalledAppService.recordConnected).toHaveBeenCalledWith({
				installed_app_id: mockOauth.installed_app_id,
			})
		})
	})
})
