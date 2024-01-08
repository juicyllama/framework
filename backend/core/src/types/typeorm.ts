import { ChartsPeriod } from '@juicyllama/utils'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions.js'
import { FxService } from '../modules/fx/fx.service.js'

export type ChartOptions<T = any> = FindManyOptions<T> & {
	search?: string
	period?: ChartsPeriod
	from?: Date
	to?: Date
}

export type CurrencyOptions = {
	fxService: FxService // the fx service we want to use
	currency?: string // the currency we want the reults in
	currency_field: string // the field used to determine the currency
	currency_fields: string[] //the fields to convert
}
