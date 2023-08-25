import { Charge } from './charges.entity'
import { ChargesService } from './charges.service'
import { ScaffoldDto, Scaffold, METHOD, TestEndpoint } from '@juicyllama/core'
import { ChargesModule } from './charges.module'
import { MockChargeRequest } from '../../test/mocks'

const E = Charge
type T = Charge
const MODULE = ChargesModule
const SERVICE = ChargesService

describe('Charges Controller', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let record: T

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		record = await scaffold.services.service.create(
			MockChargeRequest(scaffold.values.account, scaffold.values.owner),
		)
	})

	describe('List Charges', () => {
		it('Can we list the pre-generated charge?', async () => {
			await TestEndpoint<T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				url: `/billing/charges`,
				PRIMARY_KEY: 'charge_id',
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
