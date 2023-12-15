import { AppScope, OauthService } from '@juicyllama/app-store'
import { Env, Logger } from '@juicyllama/utils'
import { Test } from '@nestjs/testing'
import { LATEST_API_VERSION, Shopify } from '@shopify/shopify-api'
import { ShopifyWebhooksService } from './webhooks.service'
import { SHOPIFY_PROVIDER_TOKEN } from '../provider/provider.constants'
import { ShopifyWebhooksTopicRoutes, ShopifyWebhooksTopics } from './webhooks.enums'
import { InstalledApp } from '@juicyllama/app-store'

const getMock = jest.fn()
const putMock = jest.fn()
const postMock = jest.fn()

describe('Shopify WebhookService', () => {
	let service: ShopifyWebhooksService
	let logger: jest.Mocked<Logger>
	let oauthService: jest.Mocked<OauthService>
	let shopify: jest.Mocked<Shopify>
	const installedApp: InstalledApp = {
		installed_app_id: 1234,
		settings: { SHOPIFY_SHOP_NAME: 'installed_app_shopify_name' },
		app_id: 123456,
		active: true,
		name: 'test app',
		scope: AppScope.ACCOUNT,
	}
	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error('Tests should only be ran in the test environment')
		}
		const modRef = await Test.createTestingModule({
			providers: [
				ShopifyWebhooksService,
				{
					provide: Logger,
					useValue: {
						log: jest.fn(),
					},
				},
				{
					provide: OauthService,
					useValue: {
						findOne: jest.fn(),
					},
				},
				{
					provide: SHOPIFY_PROVIDER_TOKEN,
					useValue: {
						clients: {
							Rest: class {
								get = getMock
								put = putMock
								post = postMock
							},
						},
					},
				},
			],
		}).compile()
		service = modRef.get(ShopifyWebhooksService)
		logger = modRef.get(Logger)
		oauthService = modRef.get(OauthService)
		shopify = modRef.get(SHOPIFY_PROVIDER_TOKEN)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should define and create the service', () => {
		expect(service).toBeDefined()
	})
	describe('createWebhook', () => {
		it('should create a new webhook', async () => {
			oauthService.findOne.mockResolvedValueOnce({
				oauth_id: 123,
				access_token: 'oauth access token',
				installed_app: installedApp,
			})
			oauthService.findOne.mockResolvedValueOnce({
				oauth_id: 123,
				access_token: 'oauth access token',
				installed_app: installedApp,
			})
			getMock.mockResolvedValueOnce({
				body: {
					webhooks: [],
				},
			})
			postMock.mockResolvedValueOnce({
				body: {
					webhook: 'This is the response webhook data from creating a new webhook',
				},
			})
			expect(
				await service.createWebhook(
					installedApp,
					{
						api_version: LATEST_API_VERSION,
					},
					{
						topic: ShopifyWebhooksTopics['customers/data_request'],
					},
				),
			).toEqual('This is the response webhook data from creating a new webhook')
			expect(oauthService.findOne).toHaveBeenCalledTimes(2)
			expect(logger.log).toHaveBeenCalledTimes(2)
			expect(getMock).toHaveBeenCalledTimes(1)
			expect(getMock).toHaveBeenCalledWith({
				path: 'webhooks',
				query: {
					api_version: LATEST_API_VERSION,
					topic: ShopifyWebhooksTopics['customers/data_request'],
				},
			})
			expect(postMock).toHaveBeenCalledTimes(1)
			expect(postMock).toHaveBeenCalledWith({
				path: 'webhooks',
				data: {
					webhook: {
						format: 'json',
						topic: ShopifyWebhooksTopics['customers/data_request'],
						address: `${process.env.BASE_URL_API}/${ShopifyWebhooksTopicRoutes['customers/data_request']}?installed_app_id=1234`,
					},
				},
			})
		})
		it('should update the existing client webhooks', async () => {
			oauthService.findOne.mockResolvedValueOnce({
				oauth_id: 123,
				access_token: 'oauth access token',
				installed_app: installedApp,
			})
			oauthService.findOne.mockResolvedValueOnce({
				oauth_id: 123,
				access_token: 'oauth access token',
				installed_app: installedApp,
			})
			getMock.mockResolvedValueOnce({
				body: {
					webhooks: [
						{
							id: 1234,
						},
					],
				},
			})
			putMock.mockResolvedValueOnce({
				body: {
					webhook: 'This is the response webhook data from updating a webhook',
				},
			})
			expect(
				await service.createWebhook(
					installedApp,
					{
						api_version: LATEST_API_VERSION,
					},
					{
						topic: ShopifyWebhooksTopics['customers/data_request'],
					},
				),
			).toEqual('This is the response webhook data from updating a webhook')
			expect(oauthService.findOne).toHaveBeenCalledTimes(2)
			expect(logger.log).toHaveBeenCalledTimes(2)
			expect(getMock).toHaveBeenCalledTimes(1)
			expect(getMock).toHaveBeenCalledWith({
				path: 'webhooks',
				query: {
					api_version: LATEST_API_VERSION,
					topic: ShopifyWebhooksTopics['customers/data_request'],
				},
			})
			expect(putMock).toHaveBeenCalledTimes(1)
			expect(putMock).toHaveBeenCalledWith({
				path: 'webhooks/1234',
				data: {
					webhook: {
						address: `${process.env.BASE_URL_API}/${ShopifyWebhooksTopicRoutes['customers/data_request']}?installed_app_id=1234`,
					},
				},
			})
		})
	})
	describe('getWebhooks', () => {
		it('should return the respective webhooks', async () => {
			oauthService.findOne.mockResolvedValueOnce({
				oauth_id: 123,
				access_token: 'oauth_access_token',
				installed_app: installedApp,
			})
			getMock.mockResolvedValueOnce({
				body: {
					webhooks: [],
				},
			})
			expect(
				await service.getWebhooks(installedApp, {
					api_version: LATEST_API_VERSION,
					topic: ShopifyWebhooksTopics['customers/data_request'],
				}),
			).toEqual([])
			expect(oauthService.findOne).toHaveBeenCalledTimes(1)
			expect(getMock).toHaveBeenCalledTimes(1)
			expect(logger.log).toHaveBeenCalledWith('[app::shopify::webhook::getWebhooks] 0 Webhooks found')
		})
	})
})
