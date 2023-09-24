import { ChartsPeriod } from '@juicyllama/utils'
import { FindManyOptions } from 'typeorm'

export type ChartOptions<T = any> = FindManyOptions<T> & {
	search?: string
	period?: ChartsPeriod
	from?: Date
	to?: Date
}
