import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { faker } from '@faker-js/faker'
import { E, PRIMARY_KEY, T, NAME, MODULE, SERVICE } from './shortlinks.constants.js'
import { ShortenURLDto } from './shortlinks.dto.js'

describe(`${NAME} Service`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let mock: ShortenURLDto
	let record: T

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		mock = {
			long_url: faker.internet.url(),
		}
	})

	describe('Create', () => {
		it('Should create a new record', async () => {
			const result = await scaffold.services.service.shortenUrl(mock, scaffold.values.account)
			expect(result[PRIMARY_KEY]).toBeDefined()
			expect(result.account.account_id).toEqual(scaffold.values.account.account_id)
			expect(result.url_code).toBeDefined()
			expect(result.long_url).toBeDefined()
			expect(result.short_url).toBeDefined()
			record = result
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
