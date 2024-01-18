export class Measurements {
	/**
	 * Convert lbs to kg
	 *
	 * @param {Number} number
	 * @returns {Number}
	 */

	static LbsToKgs(number: number): number {
		return Number((Number(number) * 0.453592).toFixed(2))
	}

	/**
	 * Convert kg to lbs
	 *
	 * @param {Number} number
	 * @returns {Number}
	 */

	static KgsToLbs(number: number): number {
		return Number((Number(number) * 2.20462).toFixed(2))
	}

	/**
	 * Convert ft.inches to cm
	 *
	 * @param {Number} number
	 * @returns {Number}
	 */

	static FtInchesToCm(number: number): number {
		const [feet, inches] = number.toString().split('.')
		const totalInches = Number(feet) * 12 + Number(inches)
		return Number((Number(totalInches) * 2.54).toFixed(2))
	}

	/**
	 * Convert cm to ft.inches
	 *
	 * @param {Number} number
	 * @returns {Number}
	 */

	static CmToFtInches(number: number): number {
		const totalInches = Number(number) / 2.54
		const feet = Math.floor(totalInches / 12)
		const inches = Number(totalInches.toFixed(2)) - feet * 12
		return Number(`${feet}.${inches.toFixed(0)}`)
	}
	
}
