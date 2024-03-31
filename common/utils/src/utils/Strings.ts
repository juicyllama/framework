import { Logger } from './Logger'

export class Strings {
	/**
	 * Capitalise first letter
	 *
	 * @param {string} str
	 * @returns {string}
	 */

	static capitalize(str: string): string {
		try {
			if (typeof str !== 'string') return ''
			if (str.length === 0) return ''

			return str.charAt(0).toUpperCase() + str.slice(1)
		} catch (e: any) {
			const logger = new Logger()
			logger.warn(`[Utils::Strings::capitalize] ${e.message}`, {
				str: str,
			})
			logger.warn(`[Utils::Strings::capitalize] Stack Trace`, e.stack)
			return ''
		}
	}

	/**
	 * Replace all occurrences of a string
	 * @example replacer("My name is ${name.toUpperCase()}", {name: "Bob"})
	 *
	 * @param {string} template
	 * @param {Object} obj
	 */

	static replacer(template: string, obj: { [x: string]: any }) {
		const keys = Object.keys(obj)
		const func = Function(...keys, 'return `' + template + '`;')
		return func(...keys.map(k => obj[k]))
	}

	/**
	 * Return a string based on a number
	 *
	 * @param {Number} number
	 * @returns {string}
	 */

	static numbersToLetters(number: number): string {
		let letters = ''

		const alphabet = 'ABCDEFGHIJ'

		for (let n = 0; n < number.toString().length; n++) {
			const num = Number(number.toString().slice(n, n + 1))
			letters += alphabet.charAt(num)
		}

		return letters
	}

	static numbersTo26Letters(number: number): string {
		return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(number)
	}

	/**
	 * Convert to html
	 *
	 * @param {string} string
	 * @returns {string}
	 */

	static toHTMLConversion(string: string): string {
		string = string.replace(/\n/g, '<br />')
		return string
	}

	static fromHTMLtoStringConversion(string: string): string {
		string = string.replace(/<[^>]*>/g, '')
		return string
	}

	/**
	 * Returns a formatted string
	 * * Lowercase
	 * * Remove spaces - if skipClean
	 * * Remove dashes - if skipClean
	 *
	 * @param {string} string
	 * @returns {string}
	 */

	static az09Lowercase(string: string, skipClean?: boolean): string {
		if (!skipClean) {
			string = string.replace(/-/gi, '')
			string = string.replace(/ /gi, '')
		}

		return string.toLowerCase()
	}

	/**
	 * Returns only numbers
	 *
	 * @param {string} string
	 * @returns {string}
	 */

	static onlyNumbers(string: string): string {
		return string.replace(/\D/g, '')
	}

	/**
	 * Returns the plural of an English word.
	 *
	 * @export
	 * @param {string} word
	 * @param {number} [amount]
	 * @returns {string}
	 */
	static plural(word: string, amount?: number): string {
		if (amount !== undefined && amount === 1) {
			return word
		}
		const plural: { [key: string]: string } = {
			'(quiz)$': '$1zes',
			'^(ox)$': '$1en',
			'([m|l])ouse$': '$1ice',
			'(matr|vert|ind)ix|ex$': '$1ices',
			'(x|ch|ss|sh)$': '$1es',
			'([^aeiouy]|qu)y$': '$1ies',
			'(hive)$': '$1s',
			'(?:([^f])fe|([lr])f)$': '$1$2ves',
			'(shea|lea|loa|thie)f$': '$1ves',
			sis$: 'ses',
			'([ti])um$': '$1a',
			'(tomat|potat|ech|her|vet)o$': '$1oes',
			'(bu)s$': '$1ses',
			'(alias)$': '$1es',
			'(octop)us$': '$1i',
			'(ax|test)is$': '$1es',
			'(us)$': '$1es',
			'([^s]+)$': '$1s',
		}
		const irregular: { [key: string]: string } = {
			move: 'moves',
			foot: 'feet',
			goose: 'geese',
			sex: 'sexes',
			child: 'children',
			man: 'men',
			tooth: 'teeth',
			person: 'people',
		}
		const uncountable: string[] = [
			'sheep',
			'fish',
			'deer',
			'moose',
			'series',
			'species',
			'money',
			'rice',
			'information',
			'equipment',
			'bison',
			'cod',
			'offspring',
			'pike',
			'salmon',
			'shrimp',
			'swine',
			'trout',
			'aircraft',
			'hovercraft',
			'spacecraft',
			'sugar',
			'tuna',
			'you',
			'wood',
		]
		// save some time in the case that singular and plural are the same
		if (uncountable.indexOf(word.toLowerCase()) >= 0) {
			return word
		}
		// check for irregular forms
		for (const w in irregular) {
			const pattern = new RegExp(`${w}$`, 'i')
			const replace = irregular[w]
			if (pattern.test(word)) {
				return word.replace(pattern, replace)
			}
		}
		// check for matches using regular expressions
		for (const reg in plural) {
			const pattern = new RegExp(reg, 'i')
			if (pattern.test(word)) {
				return word.replace(pattern, plural[reg])
			}
		}
		return word
	}

	/**
	 * Returns the singular of an English word.
	 *
	 * @export
	 * @param {string} word
	 * @param {number} [amount]
	 * @returns {string}
	 */
	static singular(word: string, amount?: number): string {
		if (amount !== undefined && amount !== 1) {
			return word
		}
		const singular: { [key: string]: string } = {
			'(quiz)zes$': '$1',
			'(matr)ices$': '$1ix',
			'(vert|ind)ices$': '$1ex',
			'^(ox)en$': '$1',
			'(alias)es$': '$1',
			'(octop|vir)i$': '$1us',
			'(cris|ax|test)es$': '$1is',
			'(shoe)s$': '$1',
			'(o)es$': '$1',
			'(bus)es$': '$1',
			'([m|l])ice$': '$1ouse',
			'(x|ch|ss|sh)es$': '$1',
			'(m)ovies$': '$1ovie',
			'(s)eries$': '$1eries',
			'([^aeiouy]|qu)ies$': '$1y',
			'([lr])ves$': '$1f',
			'(tive)s$': '$1',
			'(hive)s$': '$1',
			'(li|wi|kni)ves$': '$1fe',
			'(shea|loa|lea|thie)ves$': '$1f',
			'(^analy)ses$': '$1sis',
			'((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': '$1$2sis',
			'([ti])a$': '$1um',
			'(n)ews$': '$1ews',
			'(h|bl)ouses$': '$1ouse',
			'(corpse)s$': '$1',
			'(us)es$': '$1',
			s$: '',
		}
		const irregular: { [key: string]: string } = {
			move: 'moves',
			foot: 'feet',
			goose: 'geese',
			sex: 'sexes',
			child: 'children',
			man: 'men',
			tooth: 'teeth',
			person: 'people',
		}
		const uncountable: string[] = [
			'sheep',
			'fish',
			'deer',
			'moose',
			'series',
			'species',
			'money',
			'rice',
			'information',
			'equipment',
			'bison',
			'cod',
			'offspring',
			'pike',
			'salmon',
			'shrimp',
			'swine',
			'trout',
			'aircraft',
			'hovercraft',
			'spacecraft',
			'sugar',
			'tuna',
			'you',
			'wood',
		]
		// save some time in the case that singular and plural are the same
		if (uncountable.indexOf(word.toLowerCase()) >= 0) {
			return word
		}
		// check for irregular forms
		for (const w in irregular) {
			const pattern = new RegExp(`${irregular[w]}$`, 'i')
			const replace = w
			if (pattern.test(word)) {
				return word.replace(pattern, replace)
			}
		}
		// check for matches using regular expressions
		for (const reg in singular) {
			const pattern = new RegExp(reg, 'i')
			if (pattern.test(word)) {
				return word.replace(pattern, singular[reg])
			}
		}
		return word
	}

	/**
	 * Converts strong to emojis
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	static stringToEmojis(string: string): string {
		string = string.replace(/:warning:/g, '⚠️')
		string = string.replace(/:zero:/g, '0️⃣️')
		string = string.replace(/:one:/g, '1️⃣️')
		string = string.replace(/:two:/g, '2️⃣️')
		string = string.replace(/:three:/g, '3️⃣')
		string = string.replace(/:four:/g, '4️⃣️')
		string = string.replace(/:five:/g, '5️⃣️')
		string = string.replace(/:six:/g, '6️⃣️')
		string = string.replace(/:seven:/g, '7️⃣')
		string = string.replace(/:eight:/g, '8️⃣️')
		string = string.replace(/:nine:/g, '9️⃣️')
		return string
	}

	/**
	 * Converts number to slack emojis
	 * @param number
	 * @returns {string}
	 */

	static numberToSlackEmojis(number: number): string {
		const parts = number.toString().slice()
		let string = ''

		for (const part of parts) {
			switch (part) {
				case '0':
					string += ':zero:'
					break
				case '1':
					string += ':one:'
					break
				case '2':
					string += ':two:'
					break
				case '3':
					string += ':three:'
					break
				case '4':
					string += ':four:'
					break
				case '5':
					string += ':five:'
					break
				case '6':
					string += ':six:'
					break
				case '7':
					string += ':seven:'
					break
				case '8':
					string += ':eight:'
					break
				case '9':
					string += ':nine:'
					break
			}
		}

		return string
	}

	/**
	 * Randomize a string
	 */

	static randomize(string: string): string {
		return string
			.split('')
			.sort(function () {
				return 0.5 - Math.random()
			})
			.join('')
	}
}
