export enum ChartsPeriod {
	MIN = 'MIN',
	'15MIN' = '15MIN',
	'30MIN' = '30MIN',
	HOUR = 'HOUR',
	DAY = 'DAY',
	WEEK = 'WEEK',
	MONTH = 'MONTH',
	YEAR = 'YEAR',
}

export function getMySQLTimeInterval(period: ChartsPeriod): string {
	switch (period) {
		case ChartsPeriod.MIN:
			return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / 60) * 60)'
		case ChartsPeriod['15MIN']:
			return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (15 * 60)) * (15 * 60))'
		case ChartsPeriod['30MIN']:
			return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (30 * 60)) * (30 * 60))'
		case ChartsPeriod.HOUR:
			return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (60 * 60)) * (60 * 60))'
		case ChartsPeriod.DAY:
			return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (24 * 60 * 60)) * (24 * 60 * 60))'
		case ChartsPeriod.WEEK:
			return 'FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(created_at) / (7 * 24 * 60 * 60)) * (7 * 24 * 60 * 60))'
		case ChartsPeriod.MONTH:
			return "DATE_FORMAT(created_at, '%Y-%m-01')"
		case ChartsPeriod.YEAR:
			return "DATE_FORMAT(created_at, '%Y-01-01')"
		default:
			throw new Error(`Unsupported period: ${period}`)
	}
}
