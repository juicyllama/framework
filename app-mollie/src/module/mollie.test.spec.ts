import { SupportedCurrencies } from '@juicyllama/utils'
import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { MollieService } from './mollie.service'
import { MolliePayment } from './payment/payment.entity'
import { MollieMandate } from './mandate/mandate.entity'
import { PaymentService } from './payment/payment.service'
import { MollieModule } from './mollie.module'
import { MollieCustomer } from './customer/customer.entity'

type T = MollieCustomer
const E = MollieCustomer
const MODULE = MollieModule
const SERVICE = MollieService

describe('MollieService', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto

	let payments: MolliePayment[]
	let mandate: MollieMandate

	//extra services for testing
	let paymentService: PaymentService

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		paymentService = scaffold.module.get<PaymentService>(PaymentService)
	})

	describe('AddCard', () => {
		it('Should get a redirect link', async () => {
			const response = await scaffold.services.service.addCard(scaffold.values.account)
			expect(response).toBeDefined()
		})

		it('Should be able to complete the process (redirect-back)', async () => {
			payments = await paymentService.findAll()
			const payment = await paymentService.syncPayment(payments[0])
			expect(payment).toBeInstanceOf(MolliePayment)
			expect(payment.mollie_payment_id).toBeGreaterThan(0)
		})

		it('Should be able to handle webhook', async () => {
			const payment = await paymentService.syncPayment(payments[0])
			expect(payment).toBeInstanceOf(MolliePayment)
			expect(payment.mollie_payment_id).toBeGreaterThan(0)
		})
	})

	describe('ListCards', () => {
		it('Should return a list of mandates', async () => {
			const response = await scaffold.services.service.listCards(scaffold.values.account)
			expect(response).toBeDefined()
			expect(response[0]).toBeDefined()
			expect(response[0].mollie_mandate_id).toBeGreaterThan(0)
			mandate = response[0]
		})
	})

	describe('Charge', () => {
		it('Should return a payment result', async () => {
			const response = await scaffold.services.service.charge(
				10.0,
				SupportedCurrencies.USD,
				scaffold.values.account,
			)
			expect(response).toBeDefined()
			expect(response.mollie_payment_id).toBeGreaterThan(0)
		})
	})

	describe('Get Payment', () => {
		it('Should return a payment result', async () => {
			const response = await scaffold.services.service.getPayment(payments[0].mollie_payment_id)
			expect(response).toBeDefined()
			expect(response.mollie_payment_id).toBeGreaterThan(0)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
