import { METHOD, Scaffold, ScaffoldDto, TestService } from '@juicyllama/core'
import {
	INSTALLED_APP_NAME,
	INSTALLED_APP_E,
	INSTALLED_APP_MODULE,
	INSTALLED_APP_PRIMARY_KEY,
	INSTALLED_APP_SERVICE,
	INSTALLED_APP_T,
} from './installed.constants'
import { faker } from '@faker-js/faker'
import { AppsService } from '../apps.service'
import { appWordpressMock } from '../apps.mocks'
import { installedAppWordpressMock } from './installed.mocks'

describe(`${INSTALLED_APP_NAME} Service`, () => {
	const scaffolding = new Scaffold<INSTALLED_APP_T>()
	let scaffold: ScaffoldDto<INSTALLED_APP_T>

	//extra services for testing
	let appsService: AppsService

	beforeAll(async () => {
		scaffold = await scaffolding.up(INSTALLED_APP_MODULE, INSTALLED_APP_SERVICE)

		appsService = <AppsService>scaffold.module.get(AppsService)
		const app = await appsService.create(appWordpressMock())

		scaffold.values.mock = installedAppWordpressMock(app)
	})

	describe('Create', () => {
		it('Should create a new record', async () => {
			scaffold.values.record = await TestService<INSTALLED_APP_T>({
				type: METHOD.CREATE,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: INSTALLED_APP_PRIMARY_KEY,
			})
		})
	})

	describe('Retrieve', () => {
		it('Should get all', async () => {
			await TestService<INSTALLED_APP_T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: INSTALLED_APP_PRIMARY_KEY,
			})
		})

		it('Should get one', async () => {
			await TestService<INSTALLED_APP_T>({
				type: METHOD.GET,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: INSTALLED_APP_PRIMARY_KEY,
			})
		})

		it('Count', async () => {
			await TestService<INSTALLED_APP_T>({
				type: METHOD.COUNT,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: INSTALLED_APP_PRIMARY_KEY,
			})
		})
	})

	describe('Update', () => {
		it('Should update existing record', async () => {
			scaffold.values.mock.name = faker.random.words()
			await TestService<INSTALLED_APP_T>({
				type: METHOD.UPDATE,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				record: scaffold.values.record,
				PRIMARY_KEY: INSTALLED_APP_PRIMARY_KEY,
			})
		})
	})

	describe('Delete', () => {
		it('Should delete existing record', async () => {
			await TestService<INSTALLED_APP_T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				record: scaffold.values.record,
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(INSTALLED_APP_E)
	})
})
