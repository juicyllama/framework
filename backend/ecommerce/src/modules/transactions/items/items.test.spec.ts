import { faker } from '@faker-js/faker'
import {
	App,
	AppCategory,
	AppIntegrationType,
	AppStoreIntegrationName,
	AppsService,
	InstalledApp,
	InstalledAppsService,
} from '@juicyllama/app-store'
import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { TRANSACTION_E, TRANSACTION_T } from '../transactions.constants'
import { TransactionFulfillmentStatus, TransactionPaymentStatus } from '../transactions.enums'
import { TransactionsModule } from '../transactions.module'
import { TransactionsService } from '../transactions.service'
import { STORE_T } from '../../stores/stores.constants'
import { StoresService } from '../../stores/stores.service'
import { TransactionItemsService } from './items.service'
import { SkusService } from '../../product/skus/skus.service'
import { Dates } from '@juicyllama/utils'
import { BundlesService } from '../../product/bundles/bundles.service'
import { Sku } from '../../product/skus/sku.entity'

describe('Transactions Items Testing', () => {
	const scaffolding = new Scaffold<TRANSACTION_T>()
	let scaffold: ScaffoldDto<TRANSACTION_T>

	//extra services for testing
	let storesService: StoresService
	let appsService: AppsService
	let installedAppsService: InstalledAppsService
	let transactionItemsService: TransactionItemsService
	let skusService: SkusService
	let bundlesService: BundlesService

	//extra veriables for testing
	let store: STORE_T
	let app: App
	let installed_app: InstalledApp
	let sku: Sku

	beforeAll(async () => {
		scaffold = await scaffolding.up(TransactionsModule, TransactionsService)
		storesService = scaffold.module.get<StoresService>(StoresService)
		appsService = scaffold.module.get<AppsService>(AppsService)
		installedAppsService = scaffold.module.get<InstalledAppsService>(InstalledAppsService)
		transactionItemsService = scaffold.module.get<TransactionItemsService>(TransactionItemsService)
		skusService = scaffold.module.get<SkusService>(SkusService)
		bundlesService = scaffold.module.get<BundlesService>(BundlesService)

		app = await appsService.create({
			name: faker.company.name(),
			url: faker.internet.url(),
			integration_name: AppStoreIntegrationName.shopify,
			integration_type: AppIntegrationType.OAUTH2,
			category: AppCategory.ecommerce,
		})

		installed_app = await installedAppsService.create({
			app_id: app.app_id,
			account_id: scaffold.values.account.account_id,
			name: faker.company.name(),
		})

		store = await storesService.create({
			account_id: scaffold.values.account.account_id,
			installed_app_id: installed_app.installed_app_id,
		})
	})

	describe('getSkuSoldCount()', () => {
		it('SKU transaction gets correct count', async () => {
			sku = await skusService.create({
				sku: 'TEST1',
				name: 'Test SKU 1',
				account_id: scaffold.values.account.account_id,
				installed_app_id: installed_app.installed_app_id,
				app_id: app.app_id,
			})

			const transaction = await scaffold.services.service.create({
				account_id: scaffold.values.account.account_id,
				store_id: store.store_id,
				installed_app_id: installed_app.installed_app_id,
				order_id: faker.string.numeric(10),
				order_number: faker.string.numeric(10),
				payment_status: TransactionPaymentStatus.PAID,
				fulfillment_status: TransactionFulfillmentStatus.PENDING,
				currency: 'USD',
				subtotal_price: Number(faker.finance.amount({ min: 0, max: 100, dec: 2 })),
				total_tax: Number(faker.finance.amount({ min: 0, max: 100, dec: 2 })),
				total_price: Number(faker.finance.amount({ min: 0, max: 100, dec: 2 })),
			})

			await transactionItemsService.create({
				transaction_id: transaction.transaction_id,
				sku_id: sku.sku_id,
				quantity: 5,
			})

			const count = await transactionItemsService.getSkuSoldCount(sku.sku_id, Dates.daysAgo(1), new Date())
			expect(count).toBe(5)

			await scaffold.services.service.purge(transaction)
		})

		it('Bundle transaction gets correct count', async () => {
			const bundle = await bundlesService.create({
				sku: 'BUNDLE1',
				name: 'Test Bundle',
				account_id: scaffold.values.account.account_id,
				installed_app_id: installed_app.installed_app_id,
				app_id: app.app_id,
				skus: [sku],
			})

			await bundlesService.raw(
				`UPDATE ecommerce_bundles_skus SET quantity = ${2} WHERE bundle_id = ${bundle.bundle_id} AND sku_id = ${sku.sku_id}`,
			)

			const transaction = await scaffold.services.service.create({
				account_id: scaffold.values.account.account_id,
				store_id: store.store_id,
				installed_app_id: installed_app.installed_app_id,
				order_id: faker.string.numeric(10),
				order_number: faker.string.numeric(10),
				payment_status: TransactionPaymentStatus.PAID,
				fulfillment_status: TransactionFulfillmentStatus.PENDING,
				currency: 'USD',
				subtotal_price: Number(faker.finance.amount({ min: 0, max: 100, dec: 2 })),
				total_tax: Number(faker.finance.amount({ min: 0, max: 100, dec: 2 })),
				total_price: Number(faker.finance.amount({ min: 0, max: 100, dec: 2 })),
			})

			await transactionItemsService.create({
				transaction_id: transaction.transaction_id,
				bundle_id: bundle.bundle_id,
				quantity: 5,
			})

			const count = await transactionItemsService.getSkuSoldCount(sku.sku_id, Dates.daysAgo(1), new Date())
			expect(count).toBe(10)
		})
	})

	afterAll(async () => {
		await scaffolding.down(TRANSACTION_E)
	})
})
