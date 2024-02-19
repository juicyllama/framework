import { faker } from '@faker-js/faker'
import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { XeroService } from './xero.service'
import { CurrencyCode, Invoice } from 'xero-node'
import { XeroModule } from './xero.module'
import { XeroInvoice } from './invoice/invoice.entity'

const MODULE = XeroModule
const SERVICE = XeroService
const E = XeroInvoice
type T = XeroInvoice

describe('Xero Service', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let invoice: { xero_invoice_id: number }

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Create Invoice', () => {
		it('Should create an invoice', async () => {
			const newInvoice: Invoice = {
				reference: faker.random.alphaNumeric(10),
				currencyCode: CurrencyCode.USD,
				total: 9.99,
			}

			const response = await scaffold.services.service.createInvoice({
				account: scaffold.values.account,
				invoice: newInvoice,
			})
			expect(response).toBeDefined()
			expect(response.xero_invoice_id).toBeDefined()
			invoice = response
		})
	})

	describe('Create Invoice Payment', () => {
		it('Should add a payment to an invoice', async () => {
			const response = await scaffold.services.service.createInvoicePayment(invoice.xero_invoice_id, 9.99)
			expect(response).toBeDefined()
			expect(response.xero_invoice_id).toBeDefined()
			invoice = response
		})
	})

	describe('Get Account Code', () => {
		it('Returns an account code when we pass a tag', async () => {
			const response = await scaffold.services.service.getAccountCode({
				tag_id: 1,
				name: 'test',
				created_at: undefined,
				deleted_at: undefined,
			})
			expect(response).toEqual('MISC')
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
