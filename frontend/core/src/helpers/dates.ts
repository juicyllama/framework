import { FormFieldPluginDateRangeResult, FormFieldPluginDateRangeTypeOptions } from '../types'

export function updateFormPluginDateRange(dates: FormFieldPluginDateRangeResult): FormFieldPluginDateRangeResult {
	
	const date = new Date();
	const now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
	date.getUTCDate(), date.getUTCHours(),
	date.getUTCMinutes(), date.getUTCSeconds());
	const monday = date.setDate(date.getDate() - (date.getDay() + 6) % 7)
	const monday_utc = new Date(monday).setUTCHours(0,0,0,0)
	const previous_monday = new Date(monday_utc).setDate(date.getDate() - 7)
	const start_of_month = date.setDate(1)
	const start_of_month_utc = new Date(start_of_month).setUTCHours(0,0,0,0)
	const previous_month = new Date(start_of_month_utc).setMonth(date.getMonth() - 1)

	switch (dates.type) {
		case FormFieldPluginDateRangeTypeOptions.CUSTOM:
			break

		case FormFieldPluginDateRangeTypeOptions.TODAY:
			dates.from = new Date(new Date().setUTCHours(0,0,0,0))
			dates.to = new Date(new Date().setUTCHours(23,59,59,999))
			break

		case FormFieldPluginDateRangeTypeOptions.LAST_24_HOURS:
			const Yesterday_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
			date.getUTCDate() - 1, date.getUTCHours(),
			date.getUTCMinutes(), date.getUTCSeconds())
			dates.from = new Date(Yesterday_utc)
			dates.to = new Date(now_utc)
			break

		case FormFieldPluginDateRangeTypeOptions.YESTERDAY:
			dates.from = new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setUTCHours(0,0,0,0))
			dates.to = new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setUTCHours(23,59,59,599))
			break

		case FormFieldPluginDateRangeTypeOptions.THIS_WEEK:
			dates.from = new Date(monday_utc)
			dates.to = new Date(now_utc)
			break

		case FormFieldPluginDateRangeTypeOptions.LAST_WEEK:
			dates.from = new Date(previous_monday)
			dates.to = new Date(monday_utc)
			break

		case FormFieldPluginDateRangeTypeOptions.THIS_MONTH:
			dates.from = new Date(start_of_month_utc)
			dates.to = new Date(now_utc)
			break

		case FormFieldPluginDateRangeTypeOptions.LAST_MONTH:
			dates.from = new Date(previous_month)
			dates.to = new Date(start_of_month_utc)
			break
	}
	
	return dates
}