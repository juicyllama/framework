import { Account } from './account.entity.js'
import { User } from '../users/users.entity.js'
import { MockAccountRequest } from '../../test/index.js'
import { faker } from '@faker-js/faker'
import { AccountModule } from './account.module.js'
import request from 'supertest'
import { Scaffold, ScaffoldDto, TestEndpoint } from '../../test/index.js'
import { AccountService } from './account.service.js'
import { METHOD } from '../../types/index.js'

const E = Account
type T = Account
const MODULE = AccountModule
const SERVICE = AccountService
const url = '/account'
const NAME = 'Account'
const PRIMARY_KEY = 'account_id'
const password = faker.internet.password({
	length: 20,
	memorable: false,
	pattern: /[!-~]/,
})

describe(`${NAME} Endpoints`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	//variables for testing
	let account: T
	let owner: User
	let primaryKey: number
	let owner_access_token: string

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Create', () => {
		it(`Create a new ${NAME}`, async () => {
			await request(scaffold.server)
				.post(url)
				.send(MockAccountRequest(password))
				.then(async ({ body }) => {
					try {
						expect(body.account).toBeDefined()
						expect(body.account.account_id).toBeDefined()
						expect(body.owner).toBeDefined()
						expect(body.owner.email).toBeDefined()
						account = body.account
						primaryKey = body.account.account_id
						owner = body.owner
					} catch (e: any) {
						console.error(body)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})

			await request(scaffold.server)
				.post('/auth/login')
				.send({
					email: owner.email,
					password: password,
				})
				.then(async ({ body }) => {
					try {
						expect(body.access_token).toBeDefined()
						owner_access_token = body.access_token
					} catch (e: any) {
						console.error(body)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					expect(e).toMatch('error')
				})
		})
	})

	describe('Get, List, Stats & Search', () => {
		it(`Get ${NAME}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: `${url}/${primaryKey}`,
				PRIMARY_KEY: PRIMARY_KEY,
				primaryKey: primaryKey,
				access_token: owner_access_token,
				account: account,
			})
		})

		it(`List ${NAME}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				url: url,
				PRIMARY_KEY: PRIMARY_KEY,
				access_token: owner_access_token,
				account: account,
			})
		})

		it(`Count ${NAME}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.COUNT,
				scaffold: scaffold,
				url: url,
				access_token: owner_access_token,
				account: account,
			})
		})

		it('Search by account name', async () => {
			await TestEndpoint<T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				url: url,
				PRIMARY_KEY: PRIMARY_KEY,
				queryParams: {
					search: account.account_name,
				},
				access_token: owner_access_token,
				account: account,
			})
		})
	})

	describe('Update', () => {
		const patch = {
			account_name: faker.word.sample(),
		}

		it(`Update ${NAME} `, async () => {
			await TestEndpoint<T>({
				type: METHOD.UPDATE,
				scaffold: scaffold,
				url: `${url}/${primaryKey}`,
				PRIMARY_KEY: PRIMARY_KEY,
				data: patch,
				access_token: owner_access_token,
				account: account,
			})
		})
	})

	describe('Remove', () => {
		it(`Remove ${NAME}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				url: url,
				PRIMARY_KEY: PRIMARY_KEY,
				access_token: owner_access_token,
				account: account,
			})
		})
	})

	describe('Create Additional', () => {
		it(`Create an additional ${NAME}`, async () => {
			await request(scaffold.server)
				.post(url + '/additional')
				.set({
					Authorization: 'Bearer ' + owner_access_token,
					'account-id': account.account_id.toString(),
				})
				.send({ account_name: faker.word.sample() })
				.then(async ({ body }) => {
					try {
						expect(body.account).toBeDefined()
						expect(body.account.account_id).toBeDefined()
						expect(body.owner).toBeDefined()
						expect(body.owner.email).toEqual(owner.email)
					} catch (e: any) {
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
