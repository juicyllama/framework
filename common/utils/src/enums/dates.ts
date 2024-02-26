export enum SubscriptionFrequency {
	DAILY = 1,
	WEEKLY = 7,
	BIWEEKLY = 14,
	MONTHLY = 30,
	BIMONTHLY = 60,
	QUARTERLY = 90,
	BIQUARTERLY = 180,
	YEARLY = 365,
}

/**
 * A numerical representation of time in days
 *
 * Example usage: twice a day = Frequency.DAILY * 2
 */

export enum FrequencyPerYear {
	DAILY = 365,
	TWICE_PER_WEEK = 104,
	WEEKLY = 52,
	TWICE_PER_MONTH = 24,
	MONTHLY = 12,
	QUARTERLY = 4,
	YEARLY = 1,
	NONE = 0,
}

export enum DayNames {
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
}

export enum MonthNames {
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
}

export enum MonthNamesShort {
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
}
