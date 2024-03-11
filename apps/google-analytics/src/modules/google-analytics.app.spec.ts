import { faker } from '@faker-js/faker'

import { GoogleAnalyticsApp } from './google-analytics.app'

describe('GoogleAnalyticsApp', () => {
	it('should have relevant static properties', () => {
		expect(GoogleAnalyticsApp.apiTag).toEqual(expect.any(String))
		expect(GoogleAnalyticsApp.mountRoutePrefix).toEqual(expect.any(String))
	})

	describe('createRoute', () => {
		it('should create route with prefix and remove duplicated forward slashes', () => {
			expect(GoogleAnalyticsApp.createRoute('controller//action')).toBe(
				`${GoogleAnalyticsApp.mountRoutePrefix}/controller/action`,
			)
		})
	})

	describe('createApiSubTag', () => {
		it('should format SubTag name', () => {
			const mockName = faker.lorem.words()
			expect(GoogleAnalyticsApp.createApiSubTag(mockName)).toBe(`${GoogleAnalyticsApp.apiTag}: ${mockName}`)
		})
	})
})
