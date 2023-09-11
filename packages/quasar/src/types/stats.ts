export interface StatsDataSet {
	title: string
	value: DataValue
	delta?: DataValue
	endpoint?: string
	dynamicData?: boolean
	animated?: boolean
}

export interface DataValue {
	value: number
	valueMeasurement?: string
	signOnTheLeft?: boolean
	valueSign?: string
}
