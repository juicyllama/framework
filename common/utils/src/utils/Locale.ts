import { Logger } from './Logger'

export function getLocale() {
	const logger = new Logger()

	const nav = window.navigator
	const browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage']
	let i,
		language,
		len,
		shortLanguage = null

	// support for HTML 5.1 "navigator.languages"
	if (Array.isArray(nav.languages)) {
		for (i = 0; i < nav.languages.length; i++) {
			language = nav.languages[i]
			len = language.length
			if (!shortLanguage && len) {
				shortLanguage = language
			}
			if (language && len > 2) {
				logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale Detected ', language)
				return language
			}
		}
	}

	// support for other well known properties in browsers
	for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
		language = nav[browserLanguagePropertyKeys[i]]
		//skip this loop iteration if property is null/undefined.  IE11 fix.
		if (language == null) {
			continue
		}
		len = language.length
		if (!shortLanguage && len) {
			shortLanguage = language
		}
		if (language && len > 2) {
			logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale Detected ', language)
			return language
		}
	}

	if (shortLanguage) {
		logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale Detected ', shortLanguage)
		return shortLanguage
	}

	if (process?.env?.DEFAULT_LOCALE) {
		logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale from DEFAULT_LOCALE ', process.env.DEFAULT_LOCALE)
		return process.env.DEFAULT_LOCALE
	}

	if (process?.env?.VITE_DEFAULT_LOCALE) {
		logger.verbose(
			'[@juicyllama/utils::Locale::getLocale] Locale from VITE_DEFAULT_LOCALE ',
			process.env.VITE_DEFAULT_LOCALE,
		)
		return process.env.VITE_DEFAULT_LOCALE
	}

	logger.verbose('[@juicyllama/utils::Locale::getLocale] Locale not found ', process.env.VITE_DEFAULT_LOCALE)
	return 'en-US'
}

export function getCountry() {
	return getLocale().split('-')[1]
}

export function getLanguage() {
	return getLocale().split('-')[0]
}
