import { AppScope, Oauth, OauthService } from '@juicyllama/app-store'
import {
	Store,
	StoresService,
	Transaction,
	TransactionFulfillmentStatus,
	TransactionPaymentStatus,
	TransactionsService,
} from '@juicyllama/ecommerce'
import { Env, Logger } from '@juicyllama/utils'
import { Test } from '@nestjs/testing'
import { LATEST_API_VERSION, Shopify } from '@shopify/shopify-api'
import { ShopifyOrdersMapperService } from './orders.mapper.service'
import { ShopifyOrdersService } from './orders.service'
import { SHOPIFY_PROVIDER_TOKEN } from '../provider/provider.constants'

const getMock = jest.fn()

describe('Shopify OrdersService', () => {
	let service: ShopifyOrdersService
	let logger: jest.Mocked<Logger>
	let shopify: jest.Mocked<Shopify>
	let oauthService: jest.Mocked<OauthService>
	let transactionService: jest.Mocked<TransactionsService>
	let storesService: jest.Mocked<StoresService>
	let mapperService: jest.Mocked<ShopifyOrdersMapperService>

	const installedApp = {
		installed_app_id: 1234,
		active: true,
		app_id: 123,
		name: 'test app',
		scope: AppScope.ACCOUNT,
		settings: {
			SHOPIFY_SHOP_NAME: 'test',
		},
	}

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}
		const modRef = await Test.createTestingModule({
			providers: [
				ShopifyOrdersService,
				{
					provide: Logger,
					useValue: {
						error: jest.fn(),
						log: jest.fn(),
					},
				},
				{
					provide: SHOPIFY_PROVIDER_TOKEN,
					useValue: {
						clients: {
							Rest: class {
								get = getMock
							},
						},
					},
				},
				{
					provide: OauthService,
					useValue: {
						findOne: jest.fn(),
					},
				},
				{
					provide: TransactionsService,
					useValue: {
						findOne: jest.fn(),
					},
				},
				{
					provide: StoresService,
					useValue: {
						findOne: jest.fn(),
					},
				},
				{
					provide: ShopifyOrdersMapperService,
					useValue: {
						createEcommerceTransaction: jest.fn(),
						updateEcommerceTransaction: jest.fn(),
					},
				},
			],
		}).compile()
		service = modRef.get(ShopifyOrdersService)
		logger = modRef.get(Logger)
		mapperService = modRef.get(ShopifyOrdersMapperService)
		storesService = modRef.get(StoresService)
		transactionService = modRef.get(TransactionsService)
		oauthService = modRef.get(OauthService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should create the OrdersService', () => {
		expect(service).toBeDefined()
	})

	describe('listOrders', () => {
		it('should throw an error on no Oauth', async () => {
			oauthService.findOne.mockResolvedValueOnce(null as unknown as Promise<Oauth>)
			await expect(service.listOrders(installedApp, { api_version: LATEST_API_VERSION })).rejects.toThrow(
				new Error('Oauth not found'),
			)
			expect(logger.error).toHaveBeenNthCalledWith(1, `[app::shopify::orders::listOrders] Oauth not found`, {
				installed_app_id: 1234,
			})
		})
		it('should throw an error on no store being passed, and none found', async () => {
			oauthService.findOne.mockResolvedValueOnce({
				oauth_id: 12,
				access_token: 'access_token',
				installed_app: installedApp,
			})
			storesService.findOne.mockResolvedValue(null as unknown as Store)
			await expect(service.listOrders(installedApp, { api_version: LATEST_API_VERSION })).rejects.toThrow(
				new Error('Store not found'),
			)
			expect(oauthService.findOne).toHaveBeenCalledTimes(1)
			expect(storesService.findOne).toHaveBeenCalledTimes(1)
			expect(logger.error).toHaveBeenNthCalledWith(1, '[app::shopify::orders::listOrders] Store not found', {
				installed_app_id: 1234,
			})
		})
		it('should get one page worth of orders', async () => {
			oauthService.findOne.mockResolvedValueOnce({
				oauth_id: 12,
				access_token: 'access_token',
				installed_app: installedApp,
			})
			storesService.findOne.mockResolvedValue({
				account_id: 12,
				store_id: 24,
			})
			const now = new Date()
			getMock.mockResolvedValueOnce({
				body: {
					orders: [
						{
							id: 1,
							admin_graphql_api_id: 1,
							app_id: 1234,
							buyer_accepts_marketing: true,
							checkout_id: 2,
							created_at: now,
							currency: 'USD',
							name: 'Test Order',
							number: 5,
							taxes_included: true,
							test: true,
							subtotal_price: 50,
							total_outstanding: 50,
							total_price: 50,
							total_tax: 0,
							updated_at: now,
						},
					],
				},
				pageInfo: {},
			})
			expect(await service.listOrders(installedApp, { api_version: LATEST_API_VERSION })).toEqual([
				{
					id: 1,
					admin_graphql_api_id: 1,
					app_id: 1234,
					buyer_accepts_marketing: true,
					checkout_id: 2,
					created_at: now,
					currency: 'USD',
					name: 'Test Order',
					number: 5,
					taxes_included: true,
					test: true,
					subtotal_price: 50,
					total_outstanding: 50,
					total_price: 50,
					total_tax: 0,
					updated_at: now,
				},
			])
			expect(getMock).toHaveBeenCalledTimes(1)
			expect(logger.log).toHaveBeenNthCalledWith(1, '[app::shopify::orders::listOrders] 1 Orders found')
		})
		it('should get multiple pages or orders', async () => {
			oauthService.findOne.mockResolvedValueOnce({
				oauth_id: 12,
				access_token: 'access_token',
				installed_app: installedApp,
			})
			storesService.findOne.mockResolvedValue({
				account_id: 12,
				store_id: 24,
			})
			const now = new Date()
			getMock
				.mockResolvedValueOnce({
					body: {
						orders: [
							{
								id: 1,
								admin_graphql_api_id: 1,
								app_id: 1234,
								buyer_accepts_marketing: true,
								checkout_id: 2,
								created_at: now,
								currency: 'USD',
								name: 'Test Order',
								number: 5,
								taxes_included: true,
								test: true,
								subtotal_price: 50,
								total_outstanding: 50,
								total_price: 50,
								total_tax: 0,
								updated_at: now,
							},
						],
					},
					pageInfo: {
						nextPage: {
							query: {},
						},
					},
				})
				.mockResolvedValueOnce({
					body: {
						orders: [
							{
								id: 2,
								admin_graphql_api_id: 2,
								app_id: 1234,
								buyer_accepts_marketing: true,
								checkout_id: 2,
								created_at: now,
								currency: 'USD',
								name: 'Test Order',
								number: 5,
								taxes_included: true,
								test: true,
								subtotal_price: 50,
								total_outstanding: 50,
								total_price: 50,
								total_tax: 0,
								updated_at: now,
							},
						],
					},
					pageInfo: {},
				})
			expect(await service.listOrders(installedApp, { api_version: LATEST_API_VERSION })).toEqual([
				{
					id: 1,
					admin_graphql_api_id: 1,
					app_id: 1234,
					buyer_accepts_marketing: true,
					checkout_id: 2,
					created_at: now,
					currency: 'USD',
					name: 'Test Order',
					number: 5,
					taxes_included: true,
					test: true,
					subtotal_price: 50,
					total_outstanding: 50,
					total_price: 50,
					total_tax: 0,
					updated_at: now,
				},
				{
					id: 2,
					admin_graphql_api_id: 2,
					app_id: 1234,
					buyer_accepts_marketing: true,
					checkout_id: 2,
					created_at: now,
					currency: 'USD',
					name: 'Test Order',
					number: 5,
					taxes_included: true,
					test: true,
					subtotal_price: 50,
					total_outstanding: 50,
					total_price: 50,
					total_tax: 0,
					updated_at: now,
				},
			])
			expect(getMock).toHaveBeenCalledTimes(2)
			expect(logger.log).toHaveBeenNthCalledWith(2, '[app::shopify::orders::listOrders] 2 Orders found')
		})
	})
	describe('syncOrders', () => {})
	describe('addOrUpdateOrder', () => {
		const order = {
			id: 2,
			admin_graphql_api_id: '2',
			app_id: 1234,
			buyer_accepts_marketing: true,
			checkout_id: 2,
			created_at: new Date(),
			currency: 'USD',
			name: 'Test Order',
			number: 5,
			taxes_included: true,
			test: true,
			subtotal_price: 50,
			total_outstanding: 50,
			total_price: 50,
			total_tax: 0,
			updated_at: new Date(),
			confirmed: true,
		}

		const transaction = {
			account_id: 5,
			store_id: 3,
			order_id: '2',
			installed_app_id: installedApp.installed_app_id,
			currency: 'USD',
			transaction_id: 1,
			fulfillment_status: TransactionFulfillmentStatus.SHIPPED,
			payment_status: TransactionPaymentStatus.AURHORIZED,
			subtotal_price: 0,
			total_price: 0,
			total_tax: 0,
		}

		it('should throw an error when there is no found shop', async () => {
			storesService.findOne.mockResolvedValueOnce(null as unknown as Store)
			await expect(service.addOrUpdateOrder(installedApp, order)).rejects.toThrow(new Error('Store not found'))
			expect(logger.error).toHaveBeenNthCalledWith(1, '[app::shopify::orders::addOrder] Store not found', {
				installed_app_id: installedApp.installed_app_id,
			})
		})
		it('should run the createEcommerceTransaction method', async () => {
			storesService.findOne.mockResolvedValueOnce({
				account_id: 5,
				store_id: 3,
			})
			transactionService.findOne.mockResolvedValueOnce(null as unknown as Transaction)
			mapperService.createEcommerceTransaction.mockResolvedValueOnce(transaction)
			expect(await service.addOrUpdateOrder(installedApp, order)).toEqual(transaction)
			expect(mapperService.createEcommerceTransaction).toHaveBeenCalledTimes(1)
			expect(mapperService.updateEcommerceTransaction).toHaveBeenCalledTimes(0)
		})
		it('should run the updateEcommerceTransaction method', async () => {
			storesService.findOne.mockResolvedValueOnce({
				account_id: 5,
				store_id: 3,
			})
			transactionService.findOne.mockResolvedValueOnce(transaction)
			mapperService.updateEcommerceTransaction.mockResolvedValueOnce(transaction)
			expect(await service.addOrUpdateOrder(installedApp, order)).toEqual(transaction)
			expect(mapperService.createEcommerceTransaction).toHaveBeenCalledTimes(0)
			expect(mapperService.updateEcommerceTransaction).toHaveBeenCalledTimes(1)
		})
	})
})
