import { METHOD, Scaffold, ScaffoldDto, TestService } from '@juicyllama/core'
import { APP_NAME, APP_E, APP_MODULE, APP_PRIMARY_KEY, APP_SERVICE, APP_T } from './apps.constants'
import { appWordpressMock } from './apps.mocks'
import { faker } from '@faker-js/faker'

describe(`${APP_NAME} Service`, () => {
	const scaffolding = new Scaffold<APP_T>()
	let scaffold: ScaffoldDto<APP_T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(APP_MODULE, APP_SERVICE)
		scaffold.values.mock = appWordpressMock()
	})

	describe('Create', () => {
		it('Should create a new record', async () => {
			scaffold.values.record = await TestService<APP_T>({
				type: METHOD.CREATE,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: APP_PRIMARY_KEY,
			})
		})
	})

	describe('Retrieve', () => {
		it('Should get all', async () => {
			await TestService<APP_T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: APP_PRIMARY_KEY,
			})
		})

		it('Should get one', async () => {
			await TestService<APP_T>({
				type: METHOD.GET,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: APP_PRIMARY_KEY,
			})
		})

		it('Count', async () => {
			await TestService<APP_T>({
				type: METHOD.COUNT,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: APP_PRIMARY_KEY,
			})
		})
	})

	describe('Update', () => {
		it('Should update existing record', async () => {
			scaffold.values.mock.name = faker.random.words()
			await TestService<APP_T>({
				type: METHOD.UPDATE,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				record: scaffold.values.record,
				PRIMARY_KEY: APP_PRIMARY_KEY,
			})
		})
	})

	describe('Delete', () => {
		it('Should delete existing record', async () => {
			await TestService<APP_T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				record: scaffold.values.record,
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(APP_E)
	})
})
