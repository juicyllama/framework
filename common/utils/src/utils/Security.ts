import { Enviroment } from '../enums/env.js'
import { createHash } from 'crypto'

export class Security {
	static hashPassword(password: string): string {
		if (!password) {
			throw new Error('Password is empty')
		}

		if (password.length === 128) {
			return password
		}

		return createHash('sha512').update(password).digest('hex')
	}

	/**
	 * Compare referrers to ensure they match
	 */

	static referrerCheck(referrer: string, domain: string): boolean {
		if (Enviroment[process.env.NODE_ENV] === Enviroment.production) {
			if (!referrer) {
				throw new Error('Unauthorized')
			}

			const referrer_url = new URL(referrer)
			if (referrer_url.origin !== domain) {
				throw new Error('Unauthorized')
			}
		}

		return true
	}
}
