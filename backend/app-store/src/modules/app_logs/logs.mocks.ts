import { faker } from '@faker-js/faker'
import { InstalledApp } from '../installed/installed.entity'
import { LOGS_APP_T } from './logs.constants'

export function logMock(installed_app: InstalledApp): Partial<LOGS_APP_T> {
	return {
		subject: faker.lorem.words(),
		message: faker.lorem.words(),
		installed_app: installed_app,
	}
}
