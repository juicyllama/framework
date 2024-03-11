import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { createMockGoogleCredentials } from '../../mocks'

import { OAuth2Client } from 'google-auth-library'
import { grpc } from 'google-gax'

import { GoogleAnalyticsConfigDto } from '../config/google-analytics.config.dto'

import { GoogleAnalyticsOAuthService } from './google-analytics.oauth.service'

jest.mock('google-auth-library')
jest.mock('google-gax')

describe('GoogleAnalyticsOAuthService', () => {
	let service: GoogleAnalyticsOAuthService
	let mockConfig: GoogleAnalyticsConfigDto

	beforeEach(async () => {
		mockConfig = {
			BASE_URL_API: faker.internet.url(),
			GA4_OAUTH_CLIENT_ID: faker.string.hexadecimal(),
			GA4_OAUTH_CLIENT_SECRET: faker.string.hexadecimal(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GoogleAnalyticsOAuthService,
				{
					provide: GoogleAnalyticsConfigDto,
					useValue: mockConfig,
				},
			],
		}).compile()

		service = module.get<GoogleAnalyticsOAuthService>(GoogleAnalyticsOAuthService)
	})

	it('should create service client', () => {
		expect(service).toBeDefined()
		expect(OAuth2Client).toHaveBeenCalledWith(
			mockConfig.GA4_OAUTH_CLIENT_ID,
			mockConfig.GA4_OAUTH_CLIENT_SECRET,
			expect.stringContaining(mockConfig.BASE_URL_API),
		)
	})

	describe('generateAuthUrl', () => {
		const mockTokens = createMockGoogleCredentials()

		it('should generate auth URL and state', () => {
			const mockAuthUrl = faker.internet.url()

			jest.spyOn(OAuth2Client.prototype, 'generateAuthUrl').mockReturnValue(mockAuthUrl)

			const returnValue = service.generateAuthUrl()

			expect(returnValue).toEqual({
				state: expect.any(String),
				authUrl: mockAuthUrl,
			})

			expect(OAuth2Client.prototype.generateAuthUrl).toHaveBeenCalledWith({
				access_type: 'offline',
				scope: 'https://www.googleapis.com/auth/analytics.readonly',
				prompt: 'consent', // force to return refresh_token,
				state: returnValue.state,
			})
		})
	})

	describe('getTokensFromCallbackCode', () => {
		it('should parse callback code into tokens', async () => {
			const mockTokens = createMockGoogleCredentials()
			const mockCode = faker.string.hexadecimal()

			// @ts-ignore
			jest.spyOn(OAuth2Client.prototype, 'getToken').mockResolvedValue({ tokens: mockTokens })

			await expect(service.getTokensFromCallbackCode(mockCode)).resolves.toBe(mockTokens)
		})
	})

	describe('getAuthenticatedClient', () => {
		it('should return authenticated client', () => {
			const mockTokens = createMockGoogleCredentials()

			const client = service.getAuthenticatedClient(mockTokens)

			expect(client).toBeInstanceOf(OAuth2Client)
			expect(client.setCredentials).toHaveBeenCalledWith(mockTokens)
		})
	})

	describe('createDataClientCredentials', () => {
		it('should convert OAuth2Client into Google Data client compatible credentials', () => {
			const mockClient = new OAuth2Client()

			const mockSslCredentials = {}
			const mockConvertedSslCredentials = {}
			const mockCombinedSslCredentials = {}

			;(grpc.credentials.createSsl as jest.Mock).mockReturnValue(mockSslCredentials)
			;(grpc.credentials.createFromGoogleCredential as jest.Mock).mockReturnValue(mockConvertedSslCredentials)
			;(grpc.credentials.combineChannelCredentials as jest.Mock).mockReturnValue(mockCombinedSslCredentials)

			expect(service.createDataClientCredentials(mockClient)).toBe(mockCombinedSslCredentials)
			expect(grpc.credentials.createSsl).toHaveBeenCalled()
			expect(grpc.credentials.createFromGoogleCredential).toHaveBeenCalledWith(mockClient)
			expect(grpc.credentials.combineChannelCredentials).toHaveBeenCalledWith(
				mockSslCredentials,
				mockConvertedSslCredentials,
			)
		})
	})

	afterEach(() => {
		jest.clearAllMocks()
	})
})
