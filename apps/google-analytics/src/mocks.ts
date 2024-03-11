import { faker } from '@faker-js/faker'

import { Credentials } from 'google-auth-library'

import { InstalledAppLocator } from './modules/property/google-analytics.installed-app.entity'

export function createMockInstalledAppLocator(): InstalledAppLocator {
	return { installed_app_id: faker.number.int() }
}

export function createMockGoogleCredentials(): Credentials {
	return {
		access_token: faker.string.hexadecimal(),
		refresh_token: faker.string.hexadecimal(),
		scope: faker.string.hexadecimal(),
		token_type: 'Bearer',
		expiry_date: faker.date.future().valueOf(),
	}
}

export function createMockGoogleOauth() {
	const googleCredentials = createMockGoogleCredentials()

	const installed_app_id = faker.number.int()
	return {
		oauth_id: faker.number.int(),
		installed_app_id,
		access_token: googleCredentials.access_token,
		refresh_token: googleCredentials.refresh_token,
		scope: googleCredentials.scope,
		token_type: 'Bearer',
		expires_at: new Date(googleCredentials.expiry_date),
		installed_app: {
			installed_app_id,
			app_id: faker.number.int(),
			name: faker.lorem.words(),
			scope: null,
			active: true,
		},
	}
}
