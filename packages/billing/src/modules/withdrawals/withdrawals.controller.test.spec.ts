import { Enviroment } from '@juicyllama/utils'
//@ts-ignore
import request from 'supertest'
import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { MockPaymentMethodCCRequest, MockPaymentRequest } from '../../test/mocks'
import { Withdrawal } from './withdrawals.entity'
import { PaymentMethodsService } from '../payment_methods/payment.methods.service'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { PaymentsService } from '../payments/payments.service'
import { Payment } from '../payments/payments.entity'
import { WithdrawalsService } from './withdrawals.service'
import { WithdrawalsModule } from './withdrawals.module'

const E = Withdrawal
type T = Withdrawal
const MODULE = WithdrawalsModule
const SERVICE = WithdrawalsService
const ENDPOINT_URL = `/billing/withdrawals`
const PRIMARY_KEY = `withdrawal_id`

describe('Withdrawals Controller', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	//values required for testing the controller
	let payment_method: PaymentMethod
	let paymentMethodsService: PaymentMethodsService
	let payment: Payment
	let paymentsService: PaymentsService

	beforeAll(async () => {
		if (Enviroment[process.env.NODE_ENV] !== Enviroment.test) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		scaffold = await scaffolding.up(MODULE, SERVICE)
		paymentMethodsService = scaffold.module.get<PaymentMethodsService>(PaymentMethodsService)
		paymentsService = scaffold.module.get<PaymentsService>(PaymentsService)
		payment_method = await paymentMethodsService.createPaymemtMethod({
			paymentMethod: MockPaymentMethodCCRequest(scaffold.values.account),
		})
	})

	describe('Withdraw funds #1', () => {
		it('Can we withdraw more funds than we have?', async () => {
			await request(scaffold.server)
				.post(ENDPOINT_URL)
				.set({
					Authorization: 'Bearer ' + scaffold.values.owner_access_token,
					'account-id': scaffold.values.account.account_id.toString(),
				})
				.send({
					amount: 50,
					payment_method_id: payment_method.payment_method_id,
				})
				.then(async ({ body }) => {
					expect(body.error).toMatch('Bad Request')
					expect(body.message).toMatch('Insufficient funds. USD balance is: 0')
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})
	})

	describe('Withdraw funds #1', () => {
		it('Withdraw a lower amount than our balance', async () => {
			payment = await paymentsService.create(MockPaymentRequest(scaffold.values.account, 100))

			await request(scaffold.server)
				.post(ENDPOINT_URL)
				.set({
					Authorization: 'Bearer ' + scaffold.values.owner_access_token,
					'account-id': scaffold.values.account.account_id.toString(),
				})
				.send({
					amount: 50,
					payment_method_id: payment_method.payment_method_id,
				})
				.then(async ({ body }) => {
					expect(body).toBeDefined()
					expect(body[PRIMARY_KEY]).toBeGreaterThan(0)
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})
	})

	describe('List Withdrawals', () => {
		it('Can we list the previous withdrawals?', async () => {
			await request(scaffold.server)
				.get(ENDPOINT_URL)
				.set({
					Authorization: 'Bearer ' + scaffold.values.owner_access_token,
					'account-id': scaffold.values.account.account_id.toString(),
				})
				.then(async ({ body }) => {
					expect(body[0][PRIMARY_KEY]).toBeGreaterThan(0)
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
