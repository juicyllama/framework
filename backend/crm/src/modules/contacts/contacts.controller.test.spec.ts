import { METHOD, Scaffold, ScaffoldDto, TestEndpoint } from '@juicyllama/core'
import { contactRequestMock } from './contacts.mocks'
import { faker } from '@faker-js/faker'
import { Contact } from './contacts.entity'
import { ContactsModule } from './contacts.module'
import { ContactsService } from './contacts.service'

export const E = Contact
export type T = Contact
export const NAME = 'contact'
export const PRIMARY_KEY = 'contact_id'
export const ENDPOINT_URL = '/crm/contacts'
export const MODULE = ContactsModule
export const SERVICE = ContactsService

describe(`${NAME} Endpoints`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		scaffold.values.mock = contactRequestMock()
	})

	describe(`Create ${NAME}`, () => {
		it(`Can we create the new ${NAME}?`, async () => {
			scaffold.values.record = await TestEndpoint<T>({
				type: METHOD.CREATE,
				scaffold: scaffold,
				url: ENDPOINT_URL,
				PRIMARY_KEY: PRIMARY_KEY,
				data: scaffold.values.mock,
			})
		})
	})

	describe('Get, List, Stats & Search', () => {
		it(`Get ${NAME}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: `${ENDPOINT_URL}/${scaffold.values.record?.[PRIMARY_KEY]}`,
				PRIMARY_KEY: PRIMARY_KEY,
				primaryKey: scaffold.values.record?.[PRIMARY_KEY],
			})
		})

		it(`List ${NAME}`, async () => {
			await TestEndpoint<T[]>({
				type: METHOD.LIST,
				//@ts-ignore
				scaffold: scaffold,
				url: ENDPOINT_URL,
				PRIMARY_KEY: PRIMARY_KEY,
			})
		})

		it(`Count ${NAME}`, async () => {
			await TestEndpoint<T[]>({
				type: METHOD.COUNT,
				//@ts-ignore
				scaffold: scaffold,
				url: ENDPOINT_URL,
			})
		})
	})

	describe('Update', () => {
		it(`Update ${NAME} `, async () => {
			await TestEndpoint<T>({
				type: METHOD.UPDATE,
				scaffold: scaffold,
				url: `${ENDPOINT_URL}/${scaffold.values.record?.[PRIMARY_KEY]}`,
				PRIMARY_KEY: PRIMARY_KEY,
				data: {
					first_name: faker.person.firstName(),
				},
			})
		})
	})

	describe('Remove', () => {
		it(`Remove ${NAME}`, async () => {
			await TestEndpoint<T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				url: `${ENDPOINT_URL}/${scaffold.values.record?.[PRIMARY_KEY]}`,
				PRIMARY_KEY: PRIMARY_KEY,
			})
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
