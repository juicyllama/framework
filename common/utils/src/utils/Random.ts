import FACTS from '../assets/llama.facts.json'
import { faker } from '@faker-js/faker'
import { Strings } from './Strings'

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	LOWERCASE = 'abcdefghijklmnopqrstuvwxyz',
	NUMBERS = '0123456789',
	SYMBOLS = '!@£$%^&*()_+=-{}[]<>?:;~'

export class Random {
	static LlamaFact(): string {
		return FACTS[Math.floor(Math.random() * FACTS.length)]
	}

	static get uppercase() {
		return UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]
	}

	static get lowercase() {
		return LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]
	}

	static get number() {
		return NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
	}

	static get symbol() {
		return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
	}

	static Number(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min) + min)
	}

	static String(length?: number): string {
		length ||= Math.floor(Math.random() * 8) + 5

		let result = ''

		for (let i = 0; i < length; i++) {
			switch (Math.floor(Math.random() * 3)) {
				case 0:
					result += this.uppercase
					break
				case 1:
					result += this.lowercase
					break
				case 2:
					result += this.number
					break
			}
		}
		return result
	}

	static Password(length?: number): string {
		if (!length) length = 16

		let result = ''

		//string must contain uppercase, lowercase, number and special characters

		const quotient = Math.floor(length / 4)
		const remainder = 4 % length

		for (let l = 0; l < 4; l++) {
			for (let i = 0; i < quotient; i++) {
				switch (l) {
					case 0:
						result += this.uppercase
						break
					case 1:
						result += this.lowercase
						break
					case 2:
						result += this.number
						break
					case 3:
						result += this.symbol
						break
				}
			}
		}

		result += this.String(remainder)
		return Strings.randomize(result)
	}

	static Words(
		seperator?: string,
		length?: number,
		type?: 'noun' | 'adjective' | 'adverb',
		transform?: 'capitalize',
	): string {
		if (!seperator) seperator = ' '
		if (!length) length = Math.floor(Math.random() * 5) + 1

		let result = ''

		for (let i = 0; i < length; i++) {
			let word = ''

			if (!type) {
				word = faker.word.sample()
			} else {
				switch (type) {
					case 'noun':
						word = faker.word.noun()
						break
					case 'adjective':
						word = faker.word.adjective()
						break
					case 'adverb':
						word = faker.word.adverb()
						break
				}
			}

			if (transform && transform === 'capitalize') {
				result += Strings.capitalize(word)
			} else {
				result += word
			}

			result += seperator
		}

		const pos = result.lastIndexOf(seperator)
		return result.substring(0, pos)
	}
}
