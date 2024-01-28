//@ts-ignore
import { METHOD, Scaffold, ScaffoldDto, TestEndpoint } from '@juicyllama/core'
import request from 'supertest'
import { MockChargeRequest } from '../../test/mocks'
import { Charge } from '../charges/charges.entity'
import { ChargesService } from '../charges/charges.service'
import { Wallet } from './wallet.entity'
import { WalletModule } from './wallet.module'
import { WalletService } from './wallet.service'

const E = Wallet
type T = Wallet
const MODULE = WalletModule
const SERVICE = WalletService
const ENDPOINT_URL = `/billing/wallet`
const NAME = `wallet`
const PRIMARY_KEY = `wallet_id`

describe('Wallet Controller', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let primaryKey: number

	//Values needed for testing
	let charge: Charge
	let chargesService: ChargesService

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		chargesService = scaffold.module.get<ChargesService>(ChargesService)
		charge = await chargesService.create(MockChargeRequest(scaffold.values.account, scaffold.values.owner))
	})

	describe('List Transactions', () => {
		it('Can we list the pre-generated charge?', async () => {
			const records: T[] = (await TestEndpoint<T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				url: ENDPOINT_URL,
				PRIMARY_KEY: PRIMARY_KEY,
			})) as unknown as T[]

			expect(Number(records?.[0].debit_balance)).toBe(Number(charge.amount_total))
		})
	})

	describe('Get Balances', () => {
		it('Can we get the wallet balances?', async () => {
			await request(scaffold.server)
				.get(`/billing/wallet/balances`)
				.set({
					Authorization: 'Bearer ' + scaffold.values.owner_access_token,
					'account-id': scaffold.values.account.account_id.toString(),
				})
				.then(async ({ body }) => {
					try {
						expect(body).toBeDefined()
						expect(body[0]).toBeDefined()
						expect(Number(body[0].balance)).toBe(0 - Number(charge.amount_total))
					} catch (e) {
						console.error(body)
						expect(e).toMatch('error')
					}
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
