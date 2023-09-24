import { METHOD, Scaffold, ScaffoldDto, TestEndpoint } from '@juicyllama/core'
import { ENDPOINT_URL, MODULE, NAME, PRIMARY_KEY, SERVICE, T } from './shortlinks.constants.js'
import { faker } from '@faker-js/faker'
import { ShortenURLDto } from './shortlinks.dto.js'

describe(`${NAME} Endpoints`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let mock: ShortenURLDto
	let record: T
	let primaryKey: number

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		mock = {
			long_url: faker.internet.url(),
		}
	})

	describe(`Create ${NAME}`, () => {
		it(`Can we create the new ${NAME}?`, async () => {
			record = await TestEndpoint<T>({
				type: METHOD.CREATE,
				scaffold: scaffold,
				data: mock,
				url: ENDPOINT_URL,
				PRIMARY_KEY: PRIMARY_KEY,
			})
			primaryKey = record[PRIMARY_KEY]
		})
	})

	describe(`Patch ${NAME}`, () => {
		it(`Can we assign resources the new ${NAME}?`, async () => {
			record = await TestEndpoint<T>({
				type: METHOD.PATCH,
				scaffold: scaffold,
				data: {
					resource_type: 'account',
				},
				url: `${ENDPOINT_URL}/${primaryKey}`,
				PRIMARY_KEY: PRIMARY_KEY,
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down()
	})
})
