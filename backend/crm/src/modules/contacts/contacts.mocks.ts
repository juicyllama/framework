import { faker } from '@faker-js/faker'
import { Account } from '@juicyllama/core'
import { DeepPartial } from 'typeorm'
import { Contact } from './contacts.entity'
import { ContactEmailType } from './email/email.enums'

type T = Contact

export function contactMock(account: Account): DeepPartial<T> {
	return {
		account: account,
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		emails: [{ email: faker.internet.email(), type: ContactEmailType.PERSONAL }],
	}
}

export function contactRequestMock(): DeepPartial<T> {
	return {
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		emails: [{ email: faker.internet.email(), type: ContactEmailType.PERSONAL }],
	}
}
