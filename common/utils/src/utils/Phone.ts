import CODES from '../assets/dailing_codes.json'
import { Strings } from './Strings'

export class Phone {
	/**
	 * Convert a number to cents
	 *
	 * @param {string} iso2
	 * @returns {Number}
	 */

	static internationalCode(iso2: string): string {
		const code = CODES[iso2 as keyof typeof CODES].dialling_code
		return Strings.onlyNumbers(code)
	}
}
