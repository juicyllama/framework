import { DeepPartial } from 'typeorm'
import { Setting } from './settings.entity'
import { SettingsService } from './settings.service'
import { faker } from '@faker-js/faker'
import { Scaffold, ScaffoldDto } from '../../test'
import { SettingsModule } from './settings.module'

const E = Setting
type T = Setting
const MODULE = SettingsModule
const SERVICE = SettingsService

const mock = <DeepPartial<Setting>>{
	key: <string>faker.word.sample(),
	value: { name: faker.person.fullName() },
}

describe('SettingsService', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	//extra services for testing
	let settings: Setting[]

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Create Setting', () => {
		it('Should create a new setting', async () => {
			await scaffold.services.service.create(mock.key, mock.value)
			settings = await scaffold.services.service.findAll()
			expect(settings[0].key).toBe(mock.key)
		})
	})

	describe('Retrieve', () => {
		it('Should get all settings', async () => {
			settings = await scaffold.services.service.findAll()
			expect(settings[0].key).toBe(mock.key)
		})

		it('Should get one setting', async () => {
			const result = await scaffold.services.service.findOne(mock.key)
			expect(result.key).toBe(mock.key)
		})

		it('Should get one setting value', async () => {
			const result = await scaffold.services.service.findValue(mock.key)
			expect(result.name).toBe(mock.value.name)
		})
	})

	describe('Update Setting', () => {
		it('Should update existing setting', async () => {
			const value = { name: faker.person.fullName() }
			await scaffold.services.service.update(mock.key, value)
			const result = await scaffold.services.service.findValue(mock.key)
			expect(result.name).toBe(value.name)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
