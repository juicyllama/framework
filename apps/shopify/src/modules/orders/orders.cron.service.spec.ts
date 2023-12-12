import { AppScope, InstalledApp, InstalledAppsService } from '@juicyllama/app-store'
import { Store, StoresService, TransactionFulfillmentStatus, TransactionPaymentStatus } from '@juicyllama/ecommerce'
import { Env, Logger } from '@juicyllama/utils'
import { Test } from '@nestjs/testing'
import { ShopifyOrdersCronService } from './orders.cron.service'
import { ShopifyOrdersService } from './orders.service'

describe('OrdersCronService', () => {
	let service: ShopifyOrdersCronService
	let logger: jest.Mocked<Logger>
	let installedAppsService: jest.Mocked<InstalledAppsService>
	let shopifyOrdersService: jest.Mocked<ShopifyOrdersService>
	let storesService: jest.Mocked<StoresService>

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error('Test suite should not be ran outside of the test environment')
		}

		const modRef = await Test.createTestingModule({
			providers: [
				ShopifyOrdersCronService,
				{
					provide: Logger,
					useValue: {
						log: jest.fn(),
						warn: jest.fn(),
						error: jest.fn(),
					},
				},
				{
					provide: InstalledAppsService,
					useValue: {
						findAll: jest.fn(),
						update: jest.fn(),
					},
				},
				{
					provide: ShopifyOrdersService,
					useValue: {
						syncOrders: jest.fn(),
					},
				},
				{
					provide: StoresService,
					useValue: {
						findOne: jest.fn(),
					},
				},
			],
		}).compile()

		service = modRef.get(ShopifyOrdersCronService)
		logger = modRef.get(Logger)
		installedAppsService = modRef.get(InstalledAppsService)
		shopifyOrdersService = modRef.get(ShopifyOrdersService)
		storesService = modRef.get(StoresService)
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should be able to create the service', () => {
		expect(service).toBeDefined()
	})

	describe('syncOrders', () => {
		const domain = 'app::shopify::orders::getOrders'
		const installedApp = {
			active: true,
			installed_app_id: 1,
			app_id: 1,
			name: 'Test App',
			scope: AppScope.ACCOUNT,
			settings: {
				SHOPIFY_SHOP_NAME: 'test',
			},
		}
		const store: Store = {
			account_id: 1,
			store_id: 1,
		}
		it('should find nothing to sync', async () => {
			installedAppsService.findAll.mockResolvedValueOnce([])
			expect(await service.syncOrders()).toEqual({
				shopify: {
					installed_apps: 0,
					orders: 0,
					success: 0,
					failed: 0,
					failures: [],
				},
			})
		})
		it('should have only one update', async () => {
			installedAppsService.findAll.mockResolvedValueOnce([installedApp])
			storesService.findOne.mockResolvedValueOnce(store)
			installedAppsService.update.mockResolvedValueOnce(null as unknown as InstalledApp)
			shopifyOrdersService.syncOrders.mockResolvedValueOnce([
				{
					account_id: 1,
					currency: 'USD',
					fulfillment_status: TransactionFulfillmentStatus.DELIVERED,
					installed_app_id: 1,
					order_id: '1',
					payment_status: TransactionPaymentStatus.AURHORIZED,
					store_id: 1,
					subtotal_price: 0,
					total_price: 0,
					total_tax: 0,
					transaction_id: 1,
				},
			])
			expect(await service.syncOrders()).toEqual({
				shopify: {
					installed_apps: 1,
					orders: 1,
					success: 1,
					failed: 0,
					failures: [],
				},
			})
		})
		it('should report a missing store', async () => {
			installedAppsService.findAll.mockResolvedValueOnce([installedApp])
			storesService.findOne.mockResolvedValueOnce(null as unknown as Store)
			expect(await service.syncOrders()).toEqual({
				shopify: {
					installed_apps: 1,
					orders: 0,
					success: 0,
					failed: 1,
					failures: [new Error('Store not found for installed app 1')],
				},
			})
			expect(logger.error).toHaveBeenCalledWith(`[${domain}] Store not found`, {
				installed_app_id: 1,
			})
		})
		it('should fail during updating the installed app', async () => {
			installedAppsService.update.mockRejectedValueOnce(new Error('Rejection'))
			installedAppsService.findAll.mockResolvedValueOnce([installedApp])
			storesService.findOne.mockResolvedValueOnce(store)
			expect(await service.syncOrders()).toEqual({
				shopify: {
					installed_apps: 1,
					orders: 0,
					success: 0,
					failed: 1,
					failures: [new Error('Rejection')],
				},
			})
			expect(logger.warn).toHaveBeenCalledWith(`[${domain}] Error updating installed app`, {
				installed_app_id: 1,
				error: new Error('Rejection'),
			})
		})
		it('should fail while syncing orders', async () => {
			installedAppsService.findAll.mockResolvedValueOnce([installedApp])
			storesService.findOne.mockResolvedValueOnce(store)
			installedAppsService.update.mockResolvedValueOnce(null as unknown as InstalledApp)
			shopifyOrdersService.syncOrders.mockRejectedValueOnce(new Error('Rejected'))
			expect(await service.syncOrders()).toEqual({
				shopify: {
					installed_apps: 1,
					orders: 0,
					success: 0,
					failed: 1,
					failures: [new Error('Rejected')],
				},
			})
			expect(logger.warn).toHaveBeenCalledWith(`[${domain}] Error syncing orders for store: test`, {
				installed_app_id: 1,
				store,
				error: new Error('Rejected'),
			})
		})
	})
})
