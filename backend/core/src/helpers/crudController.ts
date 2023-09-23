import { ChartsPeriod, ChartsResponseDto, StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { Query as TQuery } from '../utils/typeorm/Query'
import { TypeOrm } from '../utils/typeorm/TypeOrm'
import { BadRequestException } from '@nestjs/common'
import _ from 'lodash'
import { CsvService } from '../modules/csv/csv.service'
import { DeepPartial } from 'typeorm'
import { CrudUploadCSVResponse } from '../types/common'

export async function crudCreate<T>(options: { service: any; data: any }): Promise<T> {
	return await options.service.create(options.data)
}

export async function crudFindAll<T>(options: {
	service: any
	tQuery: TQuery<T>
	account_id?: number
	query: any
	searchFields?: string[]
	order_by?: string
}): Promise<T[]> {
	const where = options.tQuery.buildWhere({
		repository: options.service.repository,
		query: options.query,
		account_id: options.account_id ?? null,
		search_fields: options.searchFields,
	})

	const sql_options = TypeOrm.findOptions<T>(options.query, where, options.order_by)
	return await options.service.findAll(sql_options)
}

export async function crudFindOne<T>(options: {
	service: any
	query: any
	primaryKey: number
	account_id?: number
}): Promise<T> {
	const PRIMARY_KEY = TypeOrm.getPrimaryKey<T>(options.service.repository)

	const where = {
		[PRIMARY_KEY]: options.primaryKey,
		...(options.account_id ? { account: { account_id: options.account_id } } : null),
	}

	//@ts-ignore
	const sql_options = TypeOrm.findOneOptions<T>(options.query, where)
	return await options.service.findOne(sql_options)
}

export async function crudStats<T>(options: {
	service: any
	tQuery: TQuery<T>
	account_id?: number
	query: any
	method?: StatsMethods
	searchFields: string[]
}): Promise<StatsResponseDto> {
	if (!options.method) {
		options.method = StatsMethods.COUNT
	}

	const where = options.tQuery.buildWhere({
		repository: options.service.repository,
		query: options.query,
		account_id: options.account_id ?? null,
		search_fields: options.searchFields,
	})

	const sql_options = {
		where: where,
	}

	switch (options.method) {
		case StatsMethods.COUNT:
			return {
				count: await options.service.count(sql_options),
			}

		case StatsMethods.AVG:
			return {
				avg: await options.service.avg(sql_options),
			}

		case StatsMethods.SUM:
			return {
				sum: await options.service.sum(sql_options),
			}
	}
}

export async function crudCharts<T>(options: {
	service: any
	tQuery: TQuery<T>
	query: any
	account_id?: number
	search: string
	period?: ChartsPeriod
	from?: Date
	to?: Date
	fields: string[]
	searchFields: string[]
}): Promise<ChartsResponseDto> {
	const fields = _.castArray(options.fields)

	const where = options.tQuery.buildWhere({
		repository: options.service.repository,
		query: options.query,
		account_id: options.account_id ?? null,
		search_fields: options.searchFields,
	})

	const promises = fields.map(
		async field =>
			await options.service.charts(field, {
				period: options.period,
				from: options.from,
				to: options.to,
				where: where,
			}),
	)

	const results = await Promise.all(promises)

	const datasets = fields.map((field, index) => {
		return {
			label: field,
			data: results[index],
		}
	})

	return {
		datasets,
	}
}

export async function crudUpdate<T>(options: {
	service: any
	data: any
	primaryKey: number
	account_id?: number
}): Promise<T> {
	const PRIMARY_KEY = TypeOrm.getPrimaryKey<T>(options.service.repository)

	if (options.account_id) {
		const record = await options.service.findById(options.primaryKey)
		if (record.account.account_id !== options.account_id) {
			throw new BadRequestException(
				`You do not have permission to update this ${options.service.name} with #${options.primaryKey}`,
			)
		}
	}

	if (!options.primaryKey) {
		throw new BadRequestException(`Missing required field: ${PRIMARY_KEY}`)
	}

	return await options.service.update({
		[PRIMARY_KEY]: options.primaryKey,
		...options.data,
	})
}

export async function crudUploadCSV<T>(
	file: Express.Multer.File,
	mappers: string[],
	options: {
		skip_first?: boolean
		service: any
		csvService: CsvService
		account_id?: number
	},
): Promise<CrudUploadCSVResponse> {
	if (!file) {
		throw new BadRequestException(`Missing required field: file`)
	}
	if (!Boolean(file.mimetype.match(/(csv)/))) {
		throw new BadRequestException(`Not a valid csv file`)
	}
	const csv = await options.csvService.parseCsvFile(file)
	if (Object.keys(csv[0]).length !== mappers.length) {
		throw new BadRequestException(`Invalid CSV file. Expected ${mappers.length} columns, got ${csv[0].length}`)
	}
	const dtos: DeepPartial<T>[] = csv.map(row => {
		const dto = mappers.reduce(
			(dto, key) => ({
				...dto,
				[key]: row[key],
			}),
			{},
		)
		dto['account_id'] = options.account_id
		return <DeepPartial<T>>_.omitBy(dto, _.isEmpty) // remove empty values
	})
	try {
		const { affectedRows } = await options.service.bulkInsert(dtos)
		return { affectedRows }
	} catch (e: any) {
		throw new BadRequestException(e.message)
	}
}

export async function crudDelete<T>(options: { service: any; primaryKey: number; account_id?: number }): Promise<T> {
	const record = await options.service.findById(options.primaryKey)

	if (options.account_id && record.account.account_id !== options.account_id) {
		throw new BadRequestException(
			`You do not have permission to delete this ${options.service.name} with #${options.primaryKey}`,
		)
	}

	return await options.service.remove(record)
}

export async function crudPurge<T>(options: { service: any; primaryKey: number; account_id?: number }): Promise<T> {
	const record = await options.service.findById(options.primaryKey)

	if (options.account_id && record.account.account_id !== options.account_id) {
		throw new BadRequestException(
			`You do not have permission to delete this ${options.service.name} with #${options.primaryKey}`,
		)
	}

	return await options.service.purge(record)
}
