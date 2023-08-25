import { ChargesService } from './charges.service'
import { Charge } from './charges.entity'
import { ScaffoldDto, Scaffold } from '@juicyllama/core'
import { MockChargeRequest } from '../../test/mocks'
import { ChargesModule } from './charges.module'

const E = Charge
type T = Charge
const MODULE = ChargesModule
const SERVICE = ChargesService

describe('Charge Service', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let charge: T
	let mock

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		mock = MockChargeRequest(scaffold.values.account, scaffold.values.owner)
	})

	describe('Create', () => {
		it('Should create a new charge', async () => {
			const result = await scaffold.services.service.create(mock)
			expect(result.name).toBe(mock.name)
		})
	})

	describe('Retrieve', () => {
		it('Should get all charges', async () => {
			const result = await scaffold.services.service.findAll({
				where: {
					account: {
						account_id: mock.account.account_id,
					},
				},
			})
			expect(result[0].name).toBe(mock.name)
			charge = result[0]
		})

		it('Should get one', async () => {
			const result = await scaffold.services.service.findOne({
				where: {
					account: {
						account_id: mock.account.account_id,
					},
				},
			})
			expect(result.name).toBe(mock.name)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
