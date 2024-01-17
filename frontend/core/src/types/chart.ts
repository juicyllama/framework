export interface ChartUISettings {
	responsive: boolean
	maintainAspectRatio: boolean
}

export interface DataSet {
	backgroundColor: string[]
	data: number[]
	// Keys can be strings, numbers, or symbols.
	// If you know it to be strings only, you can also restrict it to that.
	[x: string]: unknown
}

export interface ChartData {
	labels: string[]
	datasets: DataSet[]
}

// interface ChartDetailsDisplayElement {
// 	display: boolean
// }

export interface ChartOptions {
	options?: ChartUISettings
	data?: ChartData
	type: 'pie' | 'line' | 'bar'
	endpoint?: string
	title: string
	dynamicData?: boolean
	displayLegend?: boolean | any
	displayTooltip?: boolean | any
	dataMapper?: (arg0: any) => any
}

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
