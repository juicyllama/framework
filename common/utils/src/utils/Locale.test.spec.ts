/**
 * @jest-environment jsdom
 */

import { Locale } from './Locale'

describe('GetLocale', () => {
	it('Make sure we can get a locale', async () => {
		const locale = new Locale()
		const result = locale.getLocale()
		expect(result).toEqual('en-US')
	})
})

describe('GetCountry', () => {
	it('Make sure we can get a country', async () => {
		const locale = new Locale()
		const country = locale.getCountry()
		expect(country).toEqual('US')
	})
})

describe('GetLanguage', () => {
	it('Make sure we can get a language', async () => {
		const locale = new Locale()
		const lang = locale.getLanguage()
		expect(lang).toEqual('en')
	})
})
