import { InstalledApp } from '../installed/installed.entity'
import { faker } from '@faker-js/faker'
import { OAUTH_APP_T } from './oauth.constants'

export function oauthMock(installed_app: InstalledApp): Partial<OAUTH_APP_T> {
	return {
		installed_app: installed_app,
		access_token: faker.random.alphaNumeric(10),
		refresh_token: faker.random.alphaNumeric(10),
		token_type: faker.random.word(),
		state: faker.random.word(),
		scope: faker.random.word(),
		redirect_url: faker.internet.url(),
		expires_at: faker.date.future(),
	}
}
