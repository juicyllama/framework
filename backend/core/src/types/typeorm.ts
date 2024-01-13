import { ChartsPeriod, SupportedCurrencies } from '@juicyllama/utils'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { FxService } from '../modules/fx/fx.service'

export type ChartOptions<T = any> = FindManyOptions<T> & {
	search?: string
	period?: ChartsPeriod
	from?: Date
	to?: Date
}

export type CurrencyOptions<T> = {
	fxService: FxService // the fx service we want to use
	currency?: SupportedCurrencies; // the currency we want the results in
	currency_field: keyof T & string; // the field used to determine the currency
	currency_fields: Array<keyof T> //the fields to convert
}
