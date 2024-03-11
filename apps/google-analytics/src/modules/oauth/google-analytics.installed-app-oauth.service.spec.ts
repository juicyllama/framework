import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { createMockGoogleCredentials, createMockGoogleOauth, createMockInstalledAppLocator } from '../../mocks'

import { InstalledApp, Oauth, OauthService } from '@juicyllama/app-store'

import { GoogleAnalyticsInstalledAppOAuthService } from './google-analytics.installed-app-oauth.service'

describe('InstalledAppAuthService', () => {
	let service: GoogleAnalyticsInstalledAppOAuthService
	let oauthService: jest.Mocked<Pick<OauthService, 'findOne' | 'update' | 'create'>>

	beforeEach(async () => {
		oauthService = {
			findOne: jest.fn(),
			update: jest.fn(),
			create: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GoogleAnalyticsInstalledAppOAuthService,
				{
					provide: OauthService,
					useValue: oauthService,
				},
			],
		}).compile()

		service = module.get<GoogleAnalyticsInstalledAppOAuthService>(GoogleAnalyticsInstalledAppOAuthService)
	})

	describe('initOauth', () => {
		const mockInstalledAppLocator = createMockInstalledAppLocator()

		const mockState = faker.string.uuid()
		const mockAuthUrl = faker.internet.url()

		it('should create oauth if does not exist', async () => {
			await expect(
				service.initOauth(mockInstalledAppLocator, { state: mockState, authUrl: mockAuthUrl }),
			).resolves.toBeUndefined()

			expect(oauthService.update).not.toHaveBeenCalled()
			expect(oauthService.create).toHaveBeenCalledWith({
				...mockInstalledAppLocator,
				state: mockState,
				redirect_url: mockAuthUrl,
			})
		})

		it('should update oauth if exists', async () => {
			const mockOauth = new Oauth({
				...createMockGoogleOauth(),
				...mockInstalledAppLocator,
			})

			oauthService.findOne.mockResolvedValue(mockOauth)

			await expect(
				service.initOauth(mockInstalledAppLocator, { state: mockState, authUrl: mockAuthUrl }),
			).resolves.toBeUndefined()

			expect(oauthService.create).not.toHaveBeenCalled()
			expect(oauthService.update).toHaveBeenCalledWith({
				oauth_id: mockOauth.oauth_id,
				...mockInstalledAppLocator,
				state: mockState,
				redirect_url: mockAuthUrl,
			})
		})
	})

	describe('storeOauth', () => {
		const mockState = faker.string.uuid()
		const mockOauth = createMockGoogleOauth()
		const mockCredentials = createMockGoogleCredentials()

		it('should throw if oauth not found by state', async () => {
			await expect(service.storeOauth(mockState, mockCredentials)).rejects.toBeInstanceOf(
				GoogleAnalyticsInstalledAppOAuthService.OAuthNotFoundException,
			)
		})

		it('should store update oauth record with tokens data', async () => {
			oauthService.findOne.mockResolvedValue(mockOauth)

			const expectedUpdate = {
				oauth_id: mockOauth.oauth_id,
				access_token: mockCredentials.access_token,
				refresh_token: mockCredentials.refresh_token,
				scope: mockCredentials.scope,
				token_type: mockCredentials.token_type,
				expires_at: new Date(mockCredentials.expiry_date),
			}

			const installed_app_id = faker.number.int()
			const mockUpdatedValue = {
				...expectedUpdate,
				installed_app_id,
				installed_app: new InstalledApp({ installed_app_id }),
			}

			oauthService.update.mockResolvedValue(mockUpdatedValue)

			await expect(service.storeOauth(mockState, mockCredentials)).resolves.toBe(mockUpdatedValue)
			expect(oauthService.update).toHaveBeenCalledWith(expectedUpdate)
		})
	})

	describe('loadSavedCredentials', () => {
		const mockInstalledAppLocator = { installed_app_id: faker.number.int() }
		const mockOauth = createMockGoogleOauth()

		it('should throw if oauth not found by state', async () => {
			await expect(service.loadSavedCredentials(mockInstalledAppLocator)).rejects.toBeInstanceOf(
				GoogleAnalyticsInstalledAppOAuthService.OAuthNotFoundException,
			)
		})

		it('should load credentials from the database in a Google Credentials format', async () => {
			oauthService.findOne.mockResolvedValue(mockOauth)

			await expect(service.loadSavedCredentials(mockInstalledAppLocator)).resolves.toEqual({
				refresh_token: mockOauth.refresh_token,
				expiry_date: mockOauth.expires_at.valueOf(),
				access_token: mockOauth.access_token,
				token_type: mockOauth.token_type,
				scope: mockOauth.scope,
			})
		})
	})
})
