import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { contactMock } from './contacts.mocks'
import { faker } from '@faker-js/faker'
import { DeepPartial } from 'typeorm'
import { Contact } from './contacts.entity'
import { ContactsModule } from './contacts.module'
import { ContactsService } from './contacts.service'

export const E = Contact
export type T = Contact
export const NAME = 'contact'
export const PRIMARY_KEY = 'contact_id'
export const MODULE = ContactsModule
export const SERVICE = ContactsService

describe(`${NAME} Service`, () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	let mock: DeepPartial<T>
	let record: T

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		mock = contactMock(scaffold.values.account)
	})

	describe('Create', () => {
		it('Should create a new record', async () => {
			const result = await scaffold.services.service.create(mock)
			expect(result[PRIMARY_KEY]).toBeDefined()
			expect(result.first_name).toBe(mock.first_name)
		})
	})

	describe('Retrieve', () => {
		it('Should get all charges', async () => {
			const result = await scaffold.services.service.findAll({
				where: {
					account: {
						account_id: mock.account.account_id,
					},
				},
			})
			expect(result[0][PRIMARY_KEY]).toBeDefined()
			expect(result[0].first_name).toBe(mock.first_name)
			record = result[0]
		})

		it('Should get one', async () => {
			const result = await scaffold.services.service.findOne({
				where: {
					account: {
						account_id: mock.account.account_id,
					},
				},
			})
			expect(result[PRIMARY_KEY]).toBeDefined()
			expect(result.first_name).toBe(mock.first_name)
		})

		it('Count', async () => {
			const result = await scaffold.services.service.count({
				where: {
					account: {
						account_id: mock.account.account_id,
					},
				},
			})
			expect(result).toBeDefined()
			expect(result).toBeGreaterThan(0)
		})
	})

	describe('Update', () => {
		it('Should update existing record', async () => {
			mock.first_name = faker.person.firstName()
			const result = await scaffold.services.service.update({
				[PRIMARY_KEY]: record[PRIMARY_KEY],
				first_name: mock.first_name,
			})
			expect(result.first_name).toBe(mock.first_name)
		})
	})

	describe('Delete', () => {
		it('Should delete existing record', async () => {
			try {
				await scaffold.services.service.remove(record)
			} catch (e: any) {
				console.error(e.message, e)
				expect(e).toBeUndefined()
			}
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
