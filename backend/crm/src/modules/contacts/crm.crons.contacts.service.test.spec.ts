import { Scaffold, ScaffoldDto } from '@juicyllama/core'
import { DeepPartial } from 'typeorm'
import { Contact } from '../contacts/contacts.entity'
import { contactMock } from '../contacts/contacts.mocks'
import { ContactsService } from '../contacts/contacts.service'
import { PRIMARY_KEY } from '../contacts/contacts.service.test.spec'
import { ContactPhone } from '../contacts/phone/phone.entity'
import { CrmCronsContactsService } from './crm.crons.contacts.service'
import { CrmCronsModule } from './crm.crons.module'

const E = ContactPhone
type T = ContactPhone
const MODULE = CrmCronsModule
const SERVICE = CrmCronsContactsService

describe('Crm Cron Contact Service', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	//extra services for testing
	let contactsService: ContactsService

	//extra values for testing
	let mock: DeepPartial<Contact>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
		contactsService = scaffold.module.get<ContactsService>(ContactsService)
		mock = contactMock(scaffold.values.account)
		mock.phones = [
			{
				number: '34630146118',
				country_iso: 'ES',
			},
		]
	})

	describe('Test cron processes an unverified number', () => {
		it('Create contact with number', async () => {
			const result = await contactsService.create(mock)
			expect(result[PRIMARY_KEY]).toBeDefined()
			expect(result.first_name).toBe(mock.first_name)
		})

		it('Run the cron', async () => {
			const result = await scaffold.services.service.validatePhoneNumbers()
			expect(result).toBeDefined()
			expect(result.phones.total).toBeGreaterThan(0)
			expect(result.phones.success).toBeGreaterThan(0)
			expect(result.phones.failed).toBe(0)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
