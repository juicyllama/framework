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
import { FxService, Scaffold, ScaffoldDto, fxMock } from '@juicyllama/core'
import { SupportedCurrencies } from '@juicyllama/utils'
import {
	TRANSACTION_CURRENCY_FIELD,
	TRANSACTION_CURRENCY_FIELDS,
	TRANSACTION_E,
	TRANSACTION_T,
} from './transactions.constants'
import { TransactionFulfillmentStatus, TransactionPaymentStatus } from './transactions.enums'
import { TransactionsModule } from './transactions.module'
import { TransactionsService } from './transactions.service'
import { STORE_T } from '../stores/stores.constants'
import { StoresService } from '../stores/stores.service'

/**
 * Tests focused around currency conversion of data
 */

describe('Transactions Currency Testing', () => {
	const scaffolding = new Scaffold<TRANSACTION_T>()
	let scaffold: ScaffoldDto<TRANSACTION_T>

	//extra services for testing
	let storesService: StoresService
	let fxService: FxService
	let appsService: AppsService
	let installedAppsService: InstalledAppsService

	//extra veriables for testing
	let store: STORE_T
	let app: App
	let installed_app: InstalledApp

	beforeAll(async () => {
		scaffold = await scaffolding.up(TransactionsModule, TransactionsService)
		storesService = scaffold.module.get<StoresService>(StoresService)
		fxService = scaffold.module.get<FxService>(FxService)
		appsService = scaffold.module.get<AppsService>(AppsService)
		installedAppsService = scaffold.module.get<InstalledAppsService>(InstalledAppsService)
	})

	describe('Inject some transactions', () => {
		it('Create a demo app', async () => {
			app = await appsService.create({
				name: faker.company.name(),
				url: faker.internet.url(),
				integration_name: AppStoreIntegrationName.shopify,
				integration_type: AppIntegrationType.OAUTH2,
				category: AppCategory.ecommerce,
			})
		})

		it('Create a demo installed app', async () => {
			installed_app = await installedAppsService.create({
				app_id: app.app_id,
				account_id: scaffold.values.account.account_id,
				name: faker.company.name(),
			})
		})

		it('Create a demo store', async () => {
			store = await storesService.create({
				account_id: scaffold.values.account.account_id,
				installed_app_id: installed_app.installed_app_id,
			})
		})

		it('Create a bunch of transactions', async () => {
			const transactions: TRANSACTION_T[] = []
			for (let i = 0; i < 100; i++) {
				transactions.push(
					await scaffold.services.service.create({
						account_id: scaffold.values.account.account_id,
						store_id: store.store_id,
						installed_app_id: installed_app.installed_app_id,
						order_id: faker.string.numeric(10),
						order_number: faker.string.numeric(10),
						payment_status: TransactionPaymentStatus.PAID,
						fulfillment_status: TransactionFulfillmentStatus.PENDING,
						currency: oneOfCurrency(),
						subtotal_price: Number(faker.finance.amount({min: 0, max: 100, dec: 2})),
						total_tax: Number(faker.finance.amount({min: 0, max: 100, dec: 2})),
						total_price: Number(faker.finance.amount({min: 0, max: 100, dec: 2})),
					}),
				)
			}
		})

		it('Create some FX rates', async () => {
			await fxService.create({
				date: new Date(),
				...fxMock,
			})
		})
	})

	describe('Convert to USD', () => {
		it('Expect all transactions to be USD', async () => {
			const transactions = await scaffold.services.service.findAll({
				account_id: scaffold.values.account.account_id,
				store_id: store.store_id,
			})

			const transactions_converted = await scaffold.services.service.findAll(
				{
					account_id: scaffold.values.account.account_id,
					store_id: store.store_id,
				},
				{
					currency: SupportedCurrencies.USD,
					fxService: fxService,
					currency_field: TRANSACTION_CURRENCY_FIELD,
					currency_fields: TRANSACTION_CURRENCY_FIELDS,
				},
			)

			for (const t in transactions) {
				expect(transactions_converted[t].currency).toEqual(SupportedCurrencies.USD)

				const org = Number(transactions[t].total_price).toFixed(2)
				//const conv = Number(transactions_converted[t].total_price).toFixed(2)
				const reversed = (
					await fxService.convert(
						transactions_converted[t].total_price,
						transactions_converted[t].currency,
						transactions[t].currency,
					)
				).toFixed(2)

				//console.log(`org: ${org} ${transactions[t].currency}, conv: ${conv} ${transactions_converted[t].currency}, reversed: ${reversed} ${transactions[t].currency}`)

				expect(Number(org)).toBeLessThan(Number(reversed) + 0.1) //expect to be within 0.1 of the original
				expect(Number(org)).toBeGreaterThan(Number(reversed) - 0.1) //expect to be within 0.1 of the original
			}
		})
	})

	describe('Convert to GBP', () => {
		it('Expect all transactions to be GBP', async () => {
			const transactions = await scaffold.services.service.findAll({
				account_id: scaffold.values.account.account_id,
				store_id: store.store_id,
			})

			const transactions_converted = await scaffold.services.service.findAll(
				{
					account_id: scaffold.values.account.account_id,
					store_id: store.store_id,
				},
				{
					currency: SupportedCurrencies.GBP,
					fxService: fxService,
					currency_field: TRANSACTION_CURRENCY_FIELD,
					currency_fields: TRANSACTION_CURRENCY_FIELDS,
				},
			)

			for (const t in transactions) {
				expect(transactions_converted[t].currency).toEqual(SupportedCurrencies.GBP)

				const org = Number(transactions[t].total_price).toFixed(2)
				//const conv = Number(transactions_converted[t].total_price).toFixed(2)
				const reversed = (
					await fxService.convert(
						transactions_converted[t].total_price,
						transactions_converted[t].currency,
						transactions[t].currency,
					)
				).toFixed(2)

				//console.log(`org: ${org} ${transactions[t].currency}, conv: ${conv} ${transactions_converted[t].currency}, reversed: ${reversed} ${transactions[t].currency}`)

				expect(Number(org)).toBeLessThan(Number(reversed) + 0.1) //expect to be within 0.1 of the original
				expect(Number(org)).toBeGreaterThan(Number(reversed) - 0.1) //expect to be within 0.1 of the original
			}
		})
	})

	//do same but for another currency

	afterAll(async () => {
		await scaffolding.down(TRANSACTION_E)
	})
})

/** return randon currency from array */

function oneOfCurrency(): SupportedCurrencies {
	const c = [
		SupportedCurrencies.AUD,
		SupportedCurrencies.CAD,
		SupportedCurrencies.EUR,
		SupportedCurrencies.GBP,
		SupportedCurrencies.USD,
	]
	const randomNumber = Math.floor(Math.random() * c.length)
	return c[randomNumber]
}
