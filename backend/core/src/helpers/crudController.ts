import {
	ChartsPeriod,
	ChartsResponseDto,
	StatsMethods,
	StatsResponseDto,
	Csv,
	File,
	Json,
	Logger,
	Objects,
} from '@juicyllama/utils'
import { Query as TQuery } from '../utils/typeorm/Query'
import { TypeOrm } from '../utils/typeorm/TypeOrm'
import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import _ from 'lodash'
import { DeepPartial, ObjectLiteral, FindOptionsWhere } from 'typeorm'
import { UploadType, ImportMode, BulkUploadResponse } from '../types/common'
import { CurrencyOptions } from '../types'

const logger = new Logger()

export async function crudCreate<T extends ObjectLiteral>(options: {
	service: any
	data: any
	account_id?: number
}): Promise<T> {
	return await options.service.create({
		...options.data,
		account_id: options.account_id ?? options.data.account_id ?? undefined,
	})
}

export async function crudFindAll<T extends ObjectLiteral>(options: {
	service: any
	tQuery: TQuery<T>
	account_id?: number
	query: any
	searchFields?: string[]
	order_by?: string
	currency?: CurrencyOptions<T>
}): Promise<T[]> {
	if (options.query.convert_currencies_to && options.currency) {
		options.currency.currency = options.query.convert_currencies_to
		delete options.query.convert_currencies_to
	}

	options.query = Objects.clean(options.query)

	const where = options.tQuery.buildWhere({
		repository: options.service.repository,
		query: options.query,
		account_id: options.account_id ?? undefined,
		search_fields: options.searchFields,
	})
	const PRIMARY_KEY = TypeOrm.getPrimaryKey<T>(options.service.repository)

	const sql_options = TypeOrm.findOptions<T>(options.query, where, PRIMARY_KEY as string)
	return await options.service.findAll(sql_options, options.currency)
}

export async function crudFindOne<T extends ObjectLiteral>(options: {
	service: any
	query: any
	primaryKey: number
	account_id?: number
	currency?: CurrencyOptions<T>
}): Promise<T> {
	const PRIMARY_KEY = TypeOrm.getPrimaryKey<T>(options.service.repository)

	if (options.query.convert_currencies_to && options.currency) {
		options.currency.currency = options.query.convert_currencies_to
		delete options.query.convert_currencies_to
	}

	options.query = Objects.clean(options.query)

	//@ts-ignore
	const where: FindOptionsWhere<T> = {
		[PRIMARY_KEY]: options.primaryKey,
		...(options.account_id ? { account: { account_id: options.account_id } } : null),
	}

	const sql_options = TypeOrm.findOneOptions<T>(options.query, where)
	return await options.service.findOne(sql_options, options.currency)
}

export async function crudStats<T extends ObjectLiteral>(options: {
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

	options.query = Objects.clean(options.query)

	const where = options.tQuery.buildWhere({
		repository: options.service.repository,
		query: options.query,
		account_id: options.account_id ?? undefined,
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

export async function crudCharts<T extends ObjectLiteral>(options: {
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
	currency?: CurrencyOptions<T>
}): Promise<ChartsResponseDto> {
	const fields = _.castArray(options.fields)

	if (options.query.convert_currencies_to && options.currency) {
		options.currency.currency = options.query.convert_currencies_to
		delete options.query.convert_currencies_to
	}

	options.query = Objects.clean(options.query)

	const where = options.tQuery.buildWhere({
		repository: options.service.repository,
		query: options.query,
		account_id: options.account_id ?? undefined,
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

export async function crudUpdate<T extends ObjectLiteral>(options: {
	service: any
	data: any
	primaryKey: number
	account_id?: number
}): Promise<T> {
	const PRIMARY_KEY = TypeOrm.getPrimaryKey<T>(options.service.repository)

	if (options.account_id) {
		const record = await options.service.findById(options.primaryKey)
		if (record?.account?.account_id && record.account.account_id !== options.account_id) {
			throw new BadRequestException(
				`You do not have permission to update this ${options.service.name} with #${options.primaryKey}`,
			)
		}
	}

	if (!options.primaryKey) {
		throw new BadRequestException(`Missing required field: ${PRIMARY_KEY as string}`)
	}

	return await options.service.update({
		[PRIMARY_KEY]: options.primaryKey,
		...options.data,
	})
}

export async function crudBulkUpload<T extends ObjectLiteral>(options: {
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
		service: options.service ? true : false,
		account_id: options.account_id,
		file: options.file
			? {
					filename: options.file && options.file.filename ? options.file.filename : null,
					mimetype: options.file && options.file.mimetype ? options.file.mimetype : null,
				}
			: false,
		raw: options.raw
			? {
					length: options.raw.length,
					start: options.raw.substring(0, 20),
					end: options.raw.substring(options.raw.length - 20, options.raw.length),
				}
			: false,
	})

	if (!options.file && !options.raw) {
		logger.debug(`[${domain}] Missing required field: file or raw`)
		throw new BadRequestException(`Missing required field: file or raw`)
	}

	if (!options.upload_type) {
		options.upload_type = UploadType.CSV
	}

	if (!options.import_mode) {
		options.import_mode = ImportMode.CREATE
	}

	if (options.mappers) {
		if (typeof options.mappers === 'string') {
			try {
				options.mappers = JSON.parse(options.mappers)
			} catch (e: any) {
				logger.debug(`[${domain}] Invalid mappers JSON`)
				throw new BadRequestException(`Invalid mappers JSON`)
			}
		}
	}

	if (!options.fields) {
		logger.debug(`[${domain}] Missing required field: fields`)
		throw new InternalServerErrorException(`Missing required field: fields`)
	}

	if (!options.dedup_field) {
		logger.debug(`[${domain}] Missing required field: dedup_field`)
		throw new InternalServerErrorException(`Missing required field: dedup_field`)
	}

	let content: any[] | undefined = undefined

	logger.debug(`[${domain}] Uploading ${options.upload_type} file`)

	switch (options.upload_type) {
		case UploadType.CSV:
			if (options.file) {
				if (!Boolean(options.file.mimetype.match(/(csv)/))) {
					logger.debug(`[${domain}] Not a valid ${options.upload_type} file`)
					throw new BadRequestException(`Not a valid ${options.upload_type} file`)
				}

				content = await Csv.parseCsvFile(options.file, options.mappers)
			} else if (options.raw) {
				const { csv_file, filePath, dirPath } = await Csv.createTempCSVFileFromString(options.raw)
				content = await Csv.parseCsvFile(csv_file, options.mappers)
				await File.unlink(filePath, dirPath)
			}
			break
		case UploadType.JSON:
			if (options.file) {
				if (!Boolean(options.file.mimetype.match(/(json)/))) {
					logger.debug(`[${domain}] Not a valid ${options.upload_type} file`)
					throw new BadRequestException(`Not a valid ${options.upload_type} file`)
				}

				content = await Json.parseJsonFile(options.file, options.mappers)
			} else if (options.raw) {
				try {
					const { json_file, filePath, dirPath } = await Json.createTempJSONFileFromString(options.raw)
					content = await Json.parseJsonFile(json_file, options.mappers)
					await File.unlink(filePath, dirPath)
				} catch (e: any) {
					logger.error(`[${domain}] ${e.message}`, e)
					throw new BadRequestException(`Invalid JSON`)
				}
			}
			break

		default:
			logger.debug(`[${domain}] Not a supported file type`)
			throw new BadRequestException(`Not a supported file type`)
	}

	if (!content?.length) {
		logger.debug(`[${domain}] No records found in ${options.upload_type} file`)
		throw new BadRequestException(`No records found in ${options.upload_type} file`)
	}

	if (Object.keys(content[0]).length !== options.fields.length) {
		logger.debug(
			`[${domain}] Invalid ${options.upload_type} file. Expected ${options.fields.length} columns, got ${
				Object.keys(content[0]).length
			}`,
		)
		throw new BadRequestException(
			`Invalid ${options.upload_type} file. Expected ${options.fields.length} columns, got ${
				Object.keys(content[0]).length
			}`,
		)
	}

	logger.debug(`[${domain}] Converting file to DTO object`)
	let dtos: DeepPartial<T>[] = content.map(row => {
		const dto: DeepPartial<T> = options.fields.reduce(
			(dto, key) => ({
				...dto,
				[key]: row[key],
			}),
			{} as DeepPartial<T>,
		)
		// @ts-ignore
		dto['account_id'] = options.account_id
		return dto
	})

	dtos = cleanDtos(dtos, options, domain)

	try {
		logger.debug(`[${domain}] Offloading DTOs to bulk service`)
		return <BulkUploadResponse>await options.service.bulk(dtos, options.import_mode, options.dedup_field)
	} catch (e) {
		const error = e as Error
		logger.error(`[${domain}] ${error.message}`, error)
		throw new BadRequestException(error.message)
	}
}

export async function crudDelete<T extends ObjectLiteral>(options: {
	service: any
	primaryKey: number
	account_id?: number
}): Promise<T> {
	const record = await options.service.findById(options.primaryKey)

	if (options.account_id && record.account.account_id !== options.account_id) {
		throw new BadRequestException(
			`You do not have permission to delete this ${options.service.name} with #${options.primaryKey}`,
		)
	}

	return await options.service.remove(record)
}

export async function crudPurge<T extends ObjectLiteral>(options: {
	service: any
	primaryKey: number
	account_id?: number
}): Promise<T> {
	const record = await options.service.findById(options.primaryKey)

	if (options.account_id && record.account.account_id !== options.account_id) {
		throw new BadRequestException(
			`You do not have permission to delete this ${options.service.name} with #${options.primaryKey}`,
		)
	}

	return await options.service.purge(record)
}

function cleanDtos<T extends ObjectLiteral>(dtos: DeepPartial<T>[], options: any, domain: string): DeepPartial<T>[] {
	//remove empty values
	for (const d in dtos) {
		dtos[d] = <DeepPartial<T>>_.omitBy<DeepPartial<T>>(dtos[d], _.isUndefined)
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
