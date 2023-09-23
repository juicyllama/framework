import CODES from '../assets/dailing_codes.json'
import { Strings } from './Strings.js'

export class Phone {
	/**
	 * Convert a number to cents
	 *
	 * @param {string} iso2
	 * @returns {Number}
	 */

	static internationalCode(iso2: string): string {
		const code = CODES[iso2].dialling_code
		return Strings.onlyNumbers(code)
	}
}
