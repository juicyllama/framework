import { SupportedCurrencies } from '../enums/currencies'

export class Numbers {
	/**
	 * Convert a number to cents
	 *
	 * @param {Number} number
	 * @returns {Number}
	 */

	static amountToCents(number: number): number {
		const cents = (Number(number) * 100).toFixed(0)
		return Number(cents)
	}

	/**
	 * Convert a number to currency based on currency code
	 * @param number
	 * @param currency
	 */
	static toCurrency(number: number, currency: SupportedCurrencies): string {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
		})

		return formatter.format(number)
	}

	/**
	 * Convert a number to financial (xx,xxx.xx)
	 */

	static toFinancial(number: number): string {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'decimal',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})

		return formatter.format(number)
	}
}
