import { SupportedCurrencies, Strings } from '@juicyllama/utils'
import { Scaffold, ScaffoldDto, TestEndpoint, METHOD } from '@juicyllama/core'
import { PaymentMethodsService } from './payment.methods.service'
import { PaymentMethod } from './payment.methods.entity'
import { PaymentMethodType } from './payment.methods.enums'
import { faker } from '@faker-js/faker'
import { PaymentMethodsModule } from './payment.methods.module'
import { DeepPartial } from 'typeorm'
import { MockPaymentMethodCCRequest } from '../../test/mocks'

const E = PaymentMethod
type T = PaymentMethod
const MODULE = PaymentMethodsModule
const SERVICE = PaymentMethodsService
const ENDPOINT_URL = `/billing/payment/methods`
const NAME = `PaymentMethod`
const PRIMARY_KEY = `payment_method_id`

describe('Payment Methods Controller', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let mock: DeepPartial<T>
	let record: T

	let paymentMethodsService: PaymentMethodsService

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		paymentMethodsService = scaffold.module.get<PaymentMethodsService>(PaymentMethodsService)

		mock = {
			redirect_url: faker.internet.url(),
			method: PaymentMethodType.creditcard,
			currency: SupportedCurrencies.USD,
		}

		record = await paymentMethodsService.createPaymentMethod({
			paymentMethod: MockPaymentMethodCCRequest(scaffold.values.account),
		})
	})

	describe(`Retrieve ${Strings.plural(NAME)}`, () => {
		it(`Should get all ${Strings.plural(NAME)}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				url: ENDPOINT_URL,
				PRIMARY_KEY: PRIMARY_KEY,
			})
		})
	})

	// describe(`Delete ${NAME}`, () => {
	// 	it('Should delete existing record', async () => {
	// 		await TestEndpoint<T>({
	// 			type: METHOD.DELETE,
	// 			scaffold: scaffold,
	// 			url: `${ENDPOINT_URL}/${record[PRIMARY_KEY]}`,
	// 			PRIMARY_KEY: PRIMARY_KEY,
	// 			primaryKey: record[PRIMARY_KEY],
	// 		})
	// 	})
	// })

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
