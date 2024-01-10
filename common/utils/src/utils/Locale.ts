export class Locale {
	getLocale() {
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
					return language
				}
			}
		}

		// support for other well known properties in browsers
		for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
			language = nav[browserLanguagePropertyKeys[i] as keyof Navigator]
			//skip this loop iteration if property is null/undefined.  IE11 fix.
			if (language == null) {
				continue
			}
			if (typeof language === 'string') {
				// Add this line to ensure language is of type string
				len = language.length
				if (!shortLanguage && len) {
					shortLanguage = language
				}
				if (language && len > 2) {
					return language
				}
			}
		}

		if (shortLanguage) {
			return shortLanguage
		}

		if (process?.env?.DEFAULT_LOCALE) {
			return process.env.DEFAULT_LOCALE
		}

		if (process?.env?.VITE_DEFAULT_LOCALE) {
			return process.env.VITE_DEFAULT_LOCALE
		}

		return 'en-US'
	}

	getCountry() {
		const locale = new Locale()
		return locale.getLocale().split('-')[1]
	}

	getLanguage() {
		const locale = new Locale()
		return locale.getLocale().split('-')[0]
	}
}
