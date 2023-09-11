export class OTP {
	/**
	 * Return a numerical OTP
	 *
	 * @param {number} length
	 * @returns {string}
	 */

	static generateVerificationCode(length: number): string {
		const characters = '0123456789'
		let result = ''
		const charactersLength = characters.length

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength))
		}

		return result
	}
}
