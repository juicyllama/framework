import { ScaffoldDto, Scaffold } from '@juicyllama/core'
import { MockChargeRequest, MockPaymentMethodCCRequest } from '../../test/mocks'
import { ChargesService } from '../charges/charges.service'
import { BillingCronService } from './billing.crons.service'
import { BillingModule } from '../billing.module'
import { Charge } from '../charges/charges.entity'
import { InvoicesService } from '../invoices/invoices.service'
import { Invoice } from '../invoices/invoices.entity'
import { PaymentsService } from '../payments/payments.service'
import { PaymentMethodType } from '../payment_methods/payment.methods.enums'
import { PaymentMethodsService } from '../payment_methods/payment.methods.service'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { PaymentType } from '../payments/payments.enums'

const E = Charge
type T = Charge
const MODULE = BillingModule
const SERVICE = BillingCronService

describe('Invoices Cron', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	//extra services for testing
	let chargesService: ChargesService
	let invoicesService: InvoicesService
	let paymentsService: PaymentsService
	let paymentMethodsService: PaymentMethodsService

	let charges: Charge[]
	let payment_method: PaymentMethod
	let invoice: Invoice

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)

		chargesService = scaffold.module.get<ChargesService>(ChargesService)
		invoicesService = scaffold.module.get<InvoicesService>(InvoicesService)
		paymentsService = scaffold.module.get<PaymentsService>(PaymentsService)
		paymentMethodsService = scaffold.module.get<PaymentMethodsService>(PaymentMethodsService)

		payment_method = await paymentMethodsService.createPaymentMethod({
			paymentMethod: MockPaymentMethodCCRequest(scaffold.values.account),
		})
	})

	describe('Generate', () => {
		it('Create some charges', async () => {
			for (let j = 0; j < Math.floor(Math.random() * (10 - 1) + 1); j++) {
				await chargesService.create(MockChargeRequest(scaffold.values.account, scaffold.values.owner))
			}

			charges = await chargesService.findAll()
			expect(charges.length).toBeGreaterThan(0)
		})

		it('Run generate invoice cron', async () => {
			const result = await scaffold.services.service.generateInvoices()
			expect(result).toBeDefined()
			expect(result.charges.total).toEqual(charges.length)
			expect(result.invoices.success).toBeGreaterThan(0)
			expect(result.invoices.failed).toEqual(0)
		})

		it('Check invoice details', async () => {
			const invoices = await invoicesService.findAll()
			invoice = invoices[0]
			expect(invoices.length).toEqual(1)
			expect(invoices[0].account.account_id).toEqual(scaffold.values.account.account_id)
			expect(Number(invoices[0].amount_total)).toEqual(
				Number(charges.reduce((a: number, b: Charge) => Number(a) + Number(b.amount_total), 0)),
			)
		})

		it('Run generate invoice cron #2', async () => {
			const result = await scaffold.services.service.generateInvoices()
			expect(result).toBeDefined()
			expect(result.charges.total).toEqual(0)
			expect(result.invoices.success).toEqual(0)
			expect(result.invoices.failed).toEqual(0)
		})
	})

	describe('Settle', () => {
		it('Create a payment for 50% of the invoice', async () => {
			await paymentsService.create({
				account: scaffold.values.account,
				amount: Number(invoice.amount_total / 2),
				type: PaymentType.payment,
				method: PaymentMethodType.creditcard,
				payment_method: payment_method,
				app_payment_id: 1,
				currency: invoice.currency,
			})
		})

		it('Run settle invoice cron #1', async () => {
			const result = await scaffold.services.service.settleInvoices()
			expect(result).toBeDefined()
			expect(result.invoices.total).toEqual(1)
			expect(result.invoices.part_paid).toEqual(1)
			expect(result.invoices.paid).toEqual(0)
		})

		it('Create a payment for second 50% of the invoice', async () => {
			await paymentsService.create({
				account: scaffold.values.account,
				amount: Number(invoice.amount_total / 2),
				type: PaymentType.payment,
				method: PaymentMethodType.creditcard,
				payment_method: payment_method,
				app_payment_id: 2,
				currency: invoice.currency,
			})
		})

		it('Run settle invoice cron #2', async () => {
			const result = await scaffold.services.service.settleInvoices()
			expect(result).toBeDefined()
			expect(result.invoices.total).toEqual(1)
			expect(result.invoices.part_paid).toEqual(0)
			expect(result.invoices.paid).toEqual(1)
		})

		it('Run settle invoice cron #3', async () => {
			const result = await scaffold.services.service.settleInvoices()
			expect(result).toBeDefined()
			expect(result.invoices.total).toEqual(0)
			expect(result.invoices.part_paid).toEqual(0)
			expect(result.invoices.paid).toEqual(0)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
