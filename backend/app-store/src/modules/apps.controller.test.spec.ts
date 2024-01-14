import { METHOD, Scaffold, ScaffoldDto, TestEndpoint } from '@juicyllama/core'
import { APP_E, APP_ENDPOINT_URL, APP_NAME, APP_PRIMARY_KEY, APP_T, APP_MODULE, APP_SERVICE } from './apps.constants'
import { Strings } from '@juicyllama/utils'
import { appWordpressMock } from './apps.mocks'

describe(`${APP_NAME} Endpoints`, () => {
	const scaffolding = new Scaffold<APP_T>()
	let scaffold: ScaffoldDto<APP_T>
	let record: APP_T

	beforeAll(async () => {
		scaffold = await scaffolding.up(APP_MODULE, APP_SERVICE)
		scaffold.values.mock = appWordpressMock()
		record = scaffold.values.record = await scaffold.services.service.create(scaffold.values.mock)
	})

	describe(`Retrieve ${Strings.plural(APP_NAME)}`, () => {
		it(`Should get all ${Strings.plural(APP_NAME)}`, async () => {
			await TestEndpoint<APP_T>({
				type: METHOD.LIST,
				scaffold: scaffold,
				url: APP_ENDPOINT_URL,
				data: scaffold.values.mock,
				PRIMARY_KEY: APP_PRIMARY_KEY,
				primaryKey: record[APP_PRIMARY_KEY],
			})
		})

		it(`Should get one ${APP_NAME}`, async () => {
			await TestEndpoint<APP_T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: `${APP_ENDPOINT_URL}/${record[APP_PRIMARY_KEY]}`,
				PRIMARY_KEY: APP_PRIMARY_KEY,
				primaryKey: record[APP_PRIMARY_KEY],
			})
		})

		it(`Count ${Strings.plural(APP_NAME)}`, async () => {
			await TestEndpoint<APP_T>({
				type: METHOD.COUNT,
				scaffold: scaffold,
				url: APP_ENDPOINT_URL,
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(APP_E)
	})
})
