import { DateRangeDto } from '../dto/date.dto'
import { StepType } from '../enums/stats'
import { MonthNames, MonthNamesShort, SubscriptionFrequency, DayNames } from '../enums/dates'

const nth = function (d: number) {
	if (d > 3 && d < 21) return 'th'
	switch (d % 10) {
		case 1:
			return 'st'
		case 2:
			return 'nd'
		case 3:
			return 'rd'
		default:
			return 'th'
	}
}

export class Dates {
	static format(date: Date, format: string): string {
		if (format === 'iso') return date.toISOString()

		date = new Date(date)

		const month = (date.getMonth() + 1).toString()
		const day = date.getDate().toString()
		const year = date.getFullYear().toString()
		const hours = date.getHours().toString()
		const minutes = date.getMinutes().toString()
		const seconds = date.getSeconds().toString()
		const milliseconds = date.getMilliseconds().toString()

		if (format === 'date') format = 'YYYY-MM-DD'
		if (format === 'time') format = 'HH:mm:ss'
		if (format === 'datetime') format = 'YYYY-MM-DD HH:mm:ss'

		return format
			.replace('YYYY', year)
			.replace('MMMM', MonthNames[date.getMonth()])
			.replace('MMM', MonthNamesShort[date.getMonth()])
			.replace('MM', month.length === 1 ? '0' + month : month)
			.replace('DD', day.length === 1 ? '0' + day : day)
			.replace('Do', day + nth(parseInt(day)))
			.replace('Day', this.dayName(date))
			.replace('HH', hours.length === 1 ? '0' + hours : hours)
			.replace('mm', minutes.length === 1 ? '0' + minutes : minutes)
			.replace('ss', seconds.length === 1 ? '0' + seconds : seconds)
			.replace(
				'SSS',
				milliseconds.length === 1
					? '00' + milliseconds
					: milliseconds.length === 2
						? '0' + milliseconds
						: milliseconds,
			)
	}

	static dayName(date: Date): string {
		let day = date.getDay() - 1
		if (day === -1) day = 6
		return DayNames[day]
	}

	private static formatZerolessValue(value: number): string {
		if (value < 10) return '0' + value

		return String(value)
	}

	/**
	 * Takes a date and adds additional days to it
	 * @param date
	 * @param days
	 * @returns
	 */

	static addDays(date: Date, days: number): Date {
		const result = new Date(date)
		result.setDate(result.getDate() + days)
		return result
	}

	/**
	 * Takes a date and subtracts days from it
	 * @param date
	 * @param days
	 * @returns
	 */

	static subtractDays(date: Date, days: number): Date {
		const result = new Date(date)
		result.setDate(result.getDate() - days)
		return result
	}

	/**
	 * Takes a date and adds additional minutes to it
	 */

	static addMinutes(date: Date, minutes: number): Date {
		const result = new Date(date)
		result.setMinutes(result.getMinutes() + minutes)
		return result
	}

	/**
	 * Takes a date and adds additional hours to it
	 * @param date
	 * @param hours
	 * @returns
	 */

	static addHours(date: Date, hours: number): Date {
		const result = new Date(date)
		result.setHours(result.getHours() + hours)
		return result
	}

	/**
	 * Takes a date and subtracts hours from it
	 * @param date
	 * @param hours
	 * @returns
	 */

	static subtractHours(date: Date, hours: number): Date {
		const result = new Date(date)
		result.setHours(result.getHours() - hours)
		return result
	}

	/**
	 * Takes a date, adds steps to it and returns the new date
	 */
	static addStep(date: Date, step: StepType, steps?: number): Date {
		if (!steps) {
			steps = 1
		}

		switch (step) {
			case StepType.HOURS:
				date.setHours(date.getHours() + Number(steps))
				return date

			case StepType.DAYS:
				date.setDate(date.getDate() + Number(steps))
				return date

			case StepType.WEEKS:
				date.setDate(date.getDate() + Number(steps * 7))
				return date

			case StepType.MONHTHS:
				date.setMonth(date.getMonth() + Number(steps))
				return date

			case StepType.YEARS:
				date.setFullYear(date.getFullYear() + Number(steps))
				return date
		}
	}

	static lastMonth(): DateRangeDto {
		const start_date = new Date()
		const end_date = new Date()

		start_date.setFullYear(start_date.getFullYear())
		start_date.setMonth(start_date.getMonth() - 1)
		start_date.setDate(1)

		end_date.setFullYear(end_date.getFullYear())
		end_date.setMonth(end_date.getMonth())
		end_date.setDate(0)

		start_date.setHours(0)
		start_date.setMinutes(0)
		start_date.setSeconds(0)
		start_date.setMilliseconds(0)

		end_date.setHours(23)
		end_date.setMinutes(59)
		end_date.setSeconds(59)
		end_date.setMilliseconds(59)

		return {
			from: start_date,
			to: end_date,
		}
	}

	/**
	 * Checks if date is between two other dates
	 */
	static isBetween(date: Date, from: Date, to: Date): boolean {
		const isBetween = (date: Date, min: Date, max: Date) =>
			date.getTime() >= min.getTime() && date.getTime() <= max.getTime()
		return isBetween(date, from, to)
	}

	static nextDate(frequency: SubscriptionFrequency): Date {
		switch (frequency) {
			case SubscriptionFrequency.DAILY:
				const day = new Date()
				day.setDate(day.getDate() + 1)
				return day
			case SubscriptionFrequency.WEEKLY:
				const week = new Date()
				week.setDate(week.getDate() + 7)
				return week
			case SubscriptionFrequency.BIWEEKLY:
				const biweek = new Date()
				biweek.setDate(biweek.getDate() + 14)
				return biweek
			case SubscriptionFrequency.MONTHLY:
				const monthly = new Date()
				monthly.setMonth(monthly.getMonth() + 1)
				return monthly
			case SubscriptionFrequency.BIMONTHLY:
				const bimonthly = new Date()
				bimonthly.setMonth(bimonthly.getMonth() + 2)
				return bimonthly
			case SubscriptionFrequency.QUARTERLY:
				const quarterly = new Date()
				quarterly.setMonth(quarterly.getMonth() + 3)
				return quarterly
			case SubscriptionFrequency.BIQUARTERLY:
				const biquarterly = new Date()
				biquarterly.setMonth(biquarterly.getMonth() + 6)
				return biquarterly
			case SubscriptionFrequency.YEARLY:
				const yearly = new Date()
				yearly.setFullYear(yearly.getFullYear() + 1)
				return yearly
		}
	}

	static ahead(date: Date): string {
		const seconds = Math.floor((date.getTime() - new Date().getTime()) / 1000)
		let interval = Math.floor(seconds / 31536000)

		if (interval >= 1) {
			if (interval === 1) return '1 year'
			return interval + ' years'
		}

		interval = Math.floor(seconds / 2592000)
		if (interval >= 1) {
			if (interval === 1) return '1 month'
			return interval + ' months'
		}

		interval = Math.floor(seconds / 86400)
		if (interval >= 1) {
			if (interval === 1) return '1 day'
			return interval + ' days'
		}

		interval = Math.floor(seconds / 3600)
		if (interval >= 1) {
			if (interval === 1) return '1 hour'
			return (seconds / 3600).toFixed(2) + ' hours'
		}

		interval = Math.floor(seconds / 60)
		if (interval >= 1) {
			if (interval === 1) return '1 minute'
			return (seconds / 60).toFixed(2) + ' minutes'
		}

		if (seconds <= 1) {
			return '1 second'
		}

		return Math.floor(seconds) + ' seconds'
	}

	static ago(date: Date, decimals: number = 2): string {
		const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

		let interval = Math.floor(seconds / 31536000)

		if (interval >= 1) {
			if (interval === 1) return '1 year ago'
			return interval + ' years ago'
		}

		interval = Math.floor(seconds / 2592000)
		if (interval >= 1) {
			if (interval === 1) return '1 month ago'
			return interval + ' months ago'
		}

		interval = Math.floor(seconds / 86400)
		if (interval >= 1) {
			if (interval === 1) return '1 day ago'
			return interval + ' days ago'
		}

		interval = Math.floor(seconds / 3600)
		if (interval >= 1) {
			if (interval === 1) return '1 hour ago'
			return (seconds / 3600).toFixed(decimals) + ' hours ago'
		}

		interval = Math.floor(seconds / 60)
		if (interval >= 1) {
			if (interval === 1) return '1 minute ago'
			return (seconds / 60).toFixed(decimals) + ' minute ago'
		}

		if (seconds <= 1) {
			return '1 second ago'
		}

		return Math.floor(seconds) + ' seconds ago'
	}

	static minutesAgo(minutes: number): Date {
		return new Date(new Date().getTime() - minutes * 60000) // minutes * 60 seconds * 1000 milliseconds
	}

	static hoursAgo(hours: number): Date {
		return new Date(new Date().getTime() - hours * 3600000) // hours * 60 minutes * 60 seconds * 1000 milliseconds
	}

	static daysAgo(days: number): Date {
		return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * days)
	}

	static weeksAgo(weeks: number): Date {
		return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7 * weeks)
	}

	static monthsAgo(months: number): Date {
		return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * months)
	}

	static yearsAgo(years: number): Date {
		return new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * years)
	}

	static daysToGo(days: number, top_level?: boolean): string {
		const remainingDaysString = (remainingDays: number) => {
			if (top_level) {
				return ''
			}
			if (remainingDays > 0) {
				return remainingDays === 1 ? ` and ${remainingDays} day` : `${remainingDays} days`
			}
			return ''
		}

		if (days > 365) {
			const years = Math.floor(days / 365)
			const remainingDays = days % 365
			if (years === 1) {
				return `${years} year${remainingDaysString(remainingDays)}`
			}
			return `${years} years${remainingDaysString(remainingDays)}`
		} else if (days > 40) {
			const months = Math.floor(days / 30)
			const remainingDays = days % 30
			if (months === 1) {
				return `${months} month${remainingDaysString(remainingDays)}`
			}
			return `${months} months${remainingDaysString(remainingDays)}`
		} else if (days > 7) {
			const weeks = Math.floor(days / 7)
			const remainingDays = days % 7
			if (weeks === 1) {
				return `${weeks} week${remainingDaysString(remainingDays)}`
			}
			return `${weeks} weeks${remainingDaysString(remainingDays)}`
		} else {
			if (days === 1) {
				return `${days} day`
			}
			return `${days} days`
		}
	}
}
