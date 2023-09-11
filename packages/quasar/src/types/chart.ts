export interface ChartUISettings {
	responsive: boolean
	maintainAspectRatio: boolean
}

export interface DataSet {
	backgroundColor: string[]
	data: number[]
}

export interface ChartData {
	labels: string[]
	datasets: DataSet[]
}
