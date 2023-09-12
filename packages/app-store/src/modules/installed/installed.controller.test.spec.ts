import { METHOD, Scaffold, ScaffoldDto, TestEndpoint } from '@juicyllama/core'
import {
	INSTALLED_APP_E,
	INSTALLED_APP_ENDPOINT_URL,
	INSTALLED_APP_NAME,
	INSTALLED_APP_PRIMARY_KEY,
	INSTALLED_APP_T,
	INSTALLED_APP_MODULE,
	INSTALLED_APP_SERVICE,
} from './installed.constants'
import { Strings } from '@juicyllama/utils'
import { AppsService } from '../apps.service'
import { installedAppWordpressMock } from './installed.mocks'
import { appWordpressMock } from '../apps.mocks'

describe(`${INSTALLED_APP_NAME} Endpoints`, () => {
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

	describe(`Create ${INSTALLED_APP_NAME}`, () => {
		it(`Can we create the new ${INSTALLED_APP_NAME}?`, async () => {
			scaffold.values.record = await TestEndpoint<INSTALLED_APP_T>({
				type: METHOD.CREATE,
				scaffold: scaffold,
				url: INSTALLED_APP_ENDPOINT_URL,
				data: scaffold.values.mock,
				PRIMARY_KEY: INSTALLED_APP_PRIMARY_KEY,
			})
		})
	})

	describe(`Retrieve ${Strings.plural(INSTALLED_APP_NAME)}`, () => {
		it(`Should get all ${Strings.plural(INSTALLED_APP_NAME)}`, async () => {
			await TestEndpoint<INSTALLED_APP_T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				url: INSTALLED_APP_ENDPOINT_URL,
				data: scaffold.values.mock,
			})
		})

		it(`Should get one ${INSTALLED_APP_NAME}`, async () => {
			await TestEndpoint<INSTALLED_APP_T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: `${INSTALLED_APP_ENDPOINT_URL}/${scaffold.values.record[INSTALLED_APP_PRIMARY_KEY]}`,
				PRIMARY_KEY: INSTALLED_APP_PRIMARY_KEY,
				primaryKey: scaffold.values.record[INSTALLED_APP_PRIMARY_KEY],
			})
		})

		it(`Count ${Strings.plural(INSTALLED_APP_NAME)}`, async () => {
			await TestEndpoint<INSTALLED_APP_T[]>({
				type: METHOD.COUNT,
				//@ts-ignore
				scaffold: scaffold,
				url: INSTALLED_APP_ENDPOINT_URL,
			})
		})
	})

	describe(`Purge ${INSTALLED_APP_NAME}`, () => {
		it('Should purge existing record', async () => {
			await TestEndpoint<INSTALLED_APP_T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				url: `${INSTALLED_APP_ENDPOINT_URL}/${scaffold.values.record[INSTALLED_APP_PRIMARY_KEY]}`,
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(INSTALLED_APP_E)
	})
})
