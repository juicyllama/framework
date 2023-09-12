import { faker } from '@faker-js/faker'
import { Account } from '../modules/accounts/account.entity'
import { User } from '../modules/users/users.entity'

export function MockAccountRequest(password?: string) {
	if (!password) {
		password = faker.internet.password({
			length: 20,
			memorable: false,
			pattern: /[!-~]/,
		})
	}

	return {
		account_name: faker.word.sample(),
		owners_email: faker.internet.email(),
		owners_password: password,
		owners_first_name: 'Owner',
		owners_last_name: 'User',
	}
}

export function MockUserRequest(account: Account): Partial<User> {
	const password = faker.internet.password({
		length: 20,
		memorable: false,
		pattern: /[!-~]/,
	})

	return {
		accounts: [account],
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		email: faker.internet.email(),
		password: password,
		password_reset: false,
	}
}
