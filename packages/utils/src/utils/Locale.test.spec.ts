/**
 * @jest-environment jsdom
 */

import { getLocale, getLanguage, getCountry } from './Locale'

describe('GetLocale', () => {
	it('Make sure we can get a locale', async () => {
		const locale = getLocale()
		expect(locale).toEqual('en-US')
	})
})

describe('GetCountry', () => {
	it('Make sure we can get a country', async () => {
		const country = getCountry()
		expect(country).toEqual('US')
	})
})

describe('GetLanguage', () => {
	it('Make sure we can get a language', async () => {
		const lang = getLanguage()
		expect(lang).toEqual('en')
	})
})
