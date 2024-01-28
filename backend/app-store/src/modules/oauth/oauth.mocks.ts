import { faker } from '@faker-js/faker'
import { InstalledApp } from '../installed/installed.entity'
import { OAUTH_APP_T } from './oauth.constants'

export function oauthMock(installed_app: InstalledApp): Partial<OAUTH_APP_T> {
	return {
		installed_app: installed_app,
		access_token: faker.string.alphanumeric(10),
		refresh_token: faker.string.alphanumeric(10),
		token_type: faker.lorem.word(),
		state: faker.lorem.word(),
		scope: faker.lorem.word(),
		redirect_url: faker.internet.url(),
		expires_at: faker.date.future(),
	}
}
