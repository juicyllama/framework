import { faker } from '@faker-js/faker'
import { Account } from '../modules/accounts/account.entity'
import { User } from '../modules/users/users.entity'

export function MockAccountRequest(password?: string) {
	if (!password) {
		password = faker.internet.password(20, false, /[!-~]/)
	}

	return {
		account_name: faker.random.words(),
		owners_email: faker.internet.email(),
		owners_password: password,
		owners_first_name: 'Owner',
		owners_last_name: 'User',
	}
}

export function MockUserRequest(account: Account): Partial<User> {
	const password = faker.internet.password(20, false, /[!-~]/)

	return {
		accounts: [account],
		first_name: faker.name.firstName(),
		last_name: faker.name.lastName(),
		email: faker.internet.email(),
		password: password,
		password_reset: false,
	}
}
