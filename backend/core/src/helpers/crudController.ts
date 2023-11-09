import {
	ChartsPeriod,
	ChartsResponseDto,
	StatsMethods,
	StatsResponseDto,
	Csv,
	File,
	Json,
	Logger,
} from '@juicyllama/utils'
import { Query as TQuery } from '../utils/typeorm/Query'
import { TypeOrm } from '../utils/typeorm/TypeOrm'
import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import _ from 'lodash'
import { DeepPartial } from 'typeorm'
import { UploadType, ImportMode, BulkUploadResponse } from '../types/common'
import { CurrencyOptions } from '../types'

const logger = new Logger()

export async function crudCreate<T>(options: { service: any; data: any; account_id?: number }): Promise<T> {
	return await options.service.create({
		...options.data,
		account_id: options.account_id ?? options.data.account_id ?? null,
	})
}

export async function crudFindAll<T>(options: {
	service: any
	tQuery: TQuery<T>
	account_id?: number
	query: any
	searchFields?: string[]
	order_by?: string
	currency?: CurrencyOptions
}): Promise<T[]> {
	if (options.query.convert_currencies_to && options.currency) {
		options.currency.currency = options.query.convert_currencies_to
		delete options.query.convert_currencies_to
	}

	const where = options.tQuery.buildWhere({
		repository: options.service.repository,
		query: options.query,
		account_id: options.account_id ?? null,
		search_fields: options.searchFields,
	})

	const sql_options = TypeOrm.findOptions<T>(options.query, where, options.order_by)
	return await options.service.findAll(sql_options, options.currency)
}

export async function crudFindOne<T>(options: {
	service: any
	query: any
	primaryKey: number
	account_id?: number
	currency?: CurrencyOptions
}): Promise<T> {
	const PRIMARY_KEY = TypeOrm.getPrimaryKey<T>(options.service.repository)

	if (options.query.convert_currencies_to && options.currency) {
		options.currency.currency = options.query.convert_currencies_to
		delete options.query.convert_currencies_to
	}

	const where = {
		[PRIMARY_KEY]: options.primaryKey,
		...(options.account_id ? { account: { account_id: options.account_id } } : null),
	}

	//@ts-ignore
	const sql_options = TypeOrm.findOneOptions<T>(options.query, where)
	return await options.service.findOne(sql_options, options.currency)
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
	currency?: CurrencyOptions
}): Promise<ChartsResponseDto> {
	const fields = _.castArray(options.fields)

	if (options.query.convert_currencies_to && options.currency) {
		options.currency.currency = options.query.convert_currencies_to
		delete options.query.convert_currencies_to
	}

	const where = options.tQuery.buildWhere({
		repository: options.service.repository,
		query: options.query,
		account_id: options.account_id ?? null,
		search_fields: options.searchFields,
	})

	const promises = fields.map(
		async field =>
			await options.service.charts(
				field,
				{
					period: options.period,
					from: options.from,
					to: options.to,
					where: where,
				},
				options.currency,
			),
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

export async function crudBulkUpload<T>(options: {
	fields: string[]
	dedup_field: string
	mappers?: { [key: string]: string }
	import_mode?: ImportMode
	upload_type?: UploadType
	service: any
	account_id?: number
	file?: Express.Multer.File
	raw?: string
}): Promise<BulkUploadResponse> {
	const domain = 'core::helpers::crudController::crudBulkUpload'

	logger.debug(`[${domain}] Validating options`, {
		fields: options.fields,
		dedup_field: options.dedup_field,
		mappers: options.mappers,
		import_mode: options.import_mode,
		upload_type: options.upload_type,
		service: options.service ? true: false,
		account_id: options.account_id,
		file: {
			is_file: options.file ? true : false,
			filename: options.file && options.file.filename ? options.file.filename : null,
			mimetype: options.file && options.file.mimetype ? options.file.mimetype : null,
		},
		raw: {
			is_raw: options.raw ? true : false,
		}
	})

	if (!options.file && !options.raw) {
		throw new BadRequestException(`Missing required field: file or raw`)
	}

	if (!options.upload_type) {
		options.upload_type = UploadType.CSV
	}

	if (!options.import_mode) {
		options.import_mode = ImportMode.CREATE
	}

	if (!options.fields) {
		throw new InternalServerErrorException(`Missing required field: fields`)
	}

	if (!options.dedup_field) {
		throw new InternalServerErrorException(`Missing required field: dedup_field`)
	}

	if (options.mappers) {
		if (typeof options.mappers === 'string') {
			try {
				options.mappers = JSON.parse(options.mappers)
			} catch (e: any) {
				throw new BadRequestException(`Invalid mappers JSON`)
			}
		}
	}

	const csv = new Csv()
	const json = new Json()
	const file = new File()
	let content: any[]

	logger.debug(`[${domain}] Uploading ${options.upload_type} file`)

	switch (options.upload_type) {
		case UploadType.CSV:
			if (options.file) {
				if (!Boolean(options.file.mimetype.match(/(csv)/))) {
					throw new BadRequestException(`Not a valid ${options.upload_type} file`)
				}

				content = await csv.parseCsvFile(options.file, options.mappers)
			} else if (options.raw) {
				const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(options.raw)
				content = await csv.parseCsvFile(csv_file)
				await file.unlink(filePath, dirPath)
			}
			break
		case UploadType.JSON:
			if (options.file) {
				if (!Boolean(options.file.mimetype.match(/(json)/))) {
					throw new BadRequestException(`Not a valid ${options.upload_type} file`)
				}

				content = await json.parseJsonFile(options.file, options.mappers)
			} else if (options.raw) {
				try {
					const { json_file, filePath, dirPath } = await json.createTempJSONFileFromString(options.raw)
					content = await json.parseJsonFile(json_file, options.mappers)
					await file.unlink(filePath, dirPath)
				} catch (e: any) {
					logger.error(`[${domain}] ${e.message}`, e)
					throw new BadRequestException(`Invalid JSON`)
				}	
			}
			break

		default:
			throw new BadRequestException(`Not a supported file type`)
	}

	if (!content.length) {
		throw new BadRequestException(`No records found in ${options.upload_type} file`)
	}

	if (Object.keys(content[0]).length !== options.fields.length) {
		throw new BadRequestException(
			`Invalid ${options.upload_type} file. Expected ${options.fields.length} columns, got ${
				Object.keys(content[0]).length
			}`,
		)
	}

	logger.debug(`[${domain}] Converting file to DTO object`)
	let dtos: DeepPartial<T>[] = content.map(row => {
		const dto = options.fields.reduce(
			(dto, key) => ({
				...dto,
				[key]: row[key],
			}),
			{},
		)
		dto['account_id'] = options.account_id
		return <DeepPartial<T>>dto
	})

	dtos = cleanDtos(dtos, options, domain)

	try {
		logger.debug(`[${domain}] Offloading DTOs to bulk service`)
		return <BulkUploadResponse>await options.service.bulk(dtos, options.import_mode, options.dedup_field)
	} catch (e) {
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

function cleanDtos<T>(dtos: DeepPartial<T>[], options: any, domain: string): DeepPartial<T>[] {
	// Remove any records with duplicate dedup_field

console.log('pre cleanDtos', dtos)

	//remove empty values
	for(const d in dtos) {
		dtos[d] = <DeepPartial<T>>_.omitBy(dtos[d], _.isUndefined)
	}

	const unique = _.uniqBy(dtos, options.dedup_field)
	logger.debug(
		`[${domain}] Removed ${dtos.length - unique.length} records with duplicate ${options.dedup_field} field values`,
	)

	// Remove any records with no dedup_field
	const clean = unique.filter(
		record =>
			!_.isEmpty(record) &&
			record[options.dedup_field] &&
			!_.isNil(record[options.dedup_field]) &&
			!_.isEmpty(record[options.dedup_field]) &&
			!_.isEqual(record[options.dedup_field], ''),
	)
	logger.debug(
		`[${domain}] Removed ${unique.length - clean.length} records with no value in ${options.dedup_field} field`,
	)

	return clean
}
