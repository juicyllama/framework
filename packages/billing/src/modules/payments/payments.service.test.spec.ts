import { PaymentsService } from './payments.service'
import { Payment } from './payments.entity'
import { ScaffoldDto, Scaffold } from '@juicyllama/core'
import { MockPaymentRequest } from '../../test/mocks'
import { PaymentsModule } from './payments.module'

const E = Payment
type T = Payment
const MODULE = PaymentsModule
const SERVICE = PaymentsService

describe('Payment Service', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let payment: Payment
	let mock

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		mock = MockPaymentRequest(scaffold.values.account)
	})

	describe('Create', () => {
		it('Should create a new payment', async () => {
			const result = await scaffold.services.service.create(mock)
			expect(result.payment_id).toBeDefined()
		})
	})

	describe('Retrieve', () => {
		it('Should get all payments', async () => {
			const result = await scaffold.services.service.findAll({
				where: {
					account: {
						account_id: mock.account.account_id,
					},
				},
			})
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].payment_id).toBeDefined()
			payment = result[0]
		})

		it('Should get one', async () => {
			const result = await scaffold.services.service.findOne({
				where: {
					account: {
						account_id: mock.account.account_id,
					},
				},
			})
			expect(result.payment_id).toBe(payment.payment_id)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
