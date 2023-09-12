import { LOGS_APP_T } from './logs.constants'
import { InstalledApp } from '../installed/installed.entity'
import { faker } from '@faker-js/faker'

export function logMock(installed_app: InstalledApp): Partial<LOGS_APP_T> {
	return {
		subject: faker.lorem.words(),
		message: faker.lorem.words(),
		installed_app: installed_app,
	}
}
