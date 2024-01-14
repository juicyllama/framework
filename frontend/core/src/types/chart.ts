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

interface DisplayElement {
	display: boolean
}

export interface ChartOptions {
	options?: ChartUISettings
	data?: ChartData
	type: 'pie' | 'line' | 'bar' | 'gauge'
	endpoint?: string
	title: string
	dynamicData?: boolean
	displayLegend?: boolean | DisplayElement
	displayTooltip?: boolean | DisplayElement
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
