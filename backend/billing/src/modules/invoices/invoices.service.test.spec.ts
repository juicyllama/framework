import { ScaffoldDto, Scaffold } from '@juicyllama/core'
import { MockInvoiceRequest } from '../../test/mocks'
import { Invoice } from './invoices.entity'
import { InvoicesModule } from './invoices.module'
import { InvoicesService } from './invoices.service'

const E = Invoice
type T = Invoice
const MODULE = InvoicesModule
const SERVICE = InvoicesService

describe('Invoice Service', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let invoice: T

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Create', () => {
		it('Should create a new invoice', async () => {
			const result = await scaffold.services.service.create(MockInvoiceRequest(scaffold.values.account))
			expect(result.invoice_id).toBeDefined()
		})
	})

	describe('Retrieve', () => {
		it('Should get all invoices', async () => {
			const result = await scaffold.services.service.findAll({
				where: {
					account: {
						account_id: scaffold.values.account.account_id,
					},
				},
			})
			expect(result).toBeDefined()
			expect(result[0]).toBeDefined()
			expect(result[0].invoice_id).toBeDefined()
			invoice = result[0]
		})

		it('Should get one', async () => {
			const result = await scaffold.services.service.findOne({
				where: {
					account: {
						account_id: scaffold.values.account.account_id,
					},
				},
			})
			expect(result.invoice_id).toBe(invoice.invoice_id)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
