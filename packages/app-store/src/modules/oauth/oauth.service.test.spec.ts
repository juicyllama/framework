import { METHOD, Scaffold, ScaffoldDto, TestService } from '@juicyllama/core'
import {
	OAUTH_APP_NAME,
	OAUTH_APP_E,
	OAUTH_APP_MODULE,
	OAUTH_APP_PRIMARY_KEY,
	OAUTH_APP_SERVICE,
	OAUTH_APP_T,
} from './oauth.constants'
import { oauthMock } from './oauth.mocks'
import { faker } from '@faker-js/faker'
import { AppsService } from '../apps.service'
import { appWordpressMock } from '../apps.mocks'
import { InstalledAppsService } from '../installed/installed.service'
import { installedAppWordpressMock } from '../installed/installed.mocks'

describe(`${OAUTH_APP_NAME} Service`, () => {
	const scaffolding = new Scaffold<OAUTH_APP_T>()
	let scaffold: ScaffoldDto<OAUTH_APP_T>

	//extra services for testing
	let appsService: AppsService
	let installedAppsService: InstalledAppsService

	beforeAll(async () => {
		scaffold = await scaffolding.up(OAUTH_APP_MODULE, OAUTH_APP_SERVICE)

		appsService = <AppsService>scaffold.module.get(AppsService)
		const app = await appsService.create(appWordpressMock())

		installedAppsService = <InstalledAppsService>scaffold.module.get(InstalledAppsService)
		const installed_app = await installedAppsService.create(installedAppWordpressMock(app))

		scaffold.values.mock = oauthMock(installed_app)
	})

	describe('Create', () => {
		it('Should create a new record', async () => {
			scaffold.values.record = await TestService<OAUTH_APP_T>({
				type: METHOD.CREATE,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: OAUTH_APP_PRIMARY_KEY,
			})
		})
	})

	describe('Retrieve', () => {
		it('Should get all', async () => {
			await TestService<OAUTH_APP_T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: OAUTH_APP_PRIMARY_KEY,
			})
		})

		it('Should get one', async () => {
			await TestService<OAUTH_APP_T>({
				type: METHOD.GET,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: OAUTH_APP_PRIMARY_KEY,
			})
		})

		it('Count', async () => {
			await TestService<OAUTH_APP_T>({
				type: METHOD.COUNT,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				PRIMARY_KEY: OAUTH_APP_PRIMARY_KEY,
			})
		})
	})

	describe('Update', () => {
		it('Should update existing record', async () => {
			scaffold.values.mock.access_token = faker.random.alphaNumeric(10)
			await TestService<OAUTH_APP_T>({
				type: METHOD.UPDATE,
				scaffold: scaffold,
				mock: scaffold.values.mock,
				record: scaffold.values.record,
				PRIMARY_KEY: OAUTH_APP_PRIMARY_KEY,
			})
		})
	})

	describe('Delete', () => {
		it('Should delete existing record', async () => {
			await TestService<OAUTH_APP_T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				record: scaffold.values.record,
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(OAUTH_APP_E)
	})
})
