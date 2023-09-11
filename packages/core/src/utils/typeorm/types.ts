import { ChartsPeriod } from '@juicyllama/utils'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'

export type ChartOptions<T = any> = FindManyOptions<T> & {
	search?: string
	period?: ChartsPeriod
	from?: Date
	to?: Date
}
