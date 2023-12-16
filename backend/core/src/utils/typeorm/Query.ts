import {
	And,
	DeepPartial,
	Equal,
	FindManyOptions,
	FindOneOptions,
	FindOperator,
	InsertResult,
	In,
	IsNull,
	LessThan,
	LessThanOrEqual,
	Like,
	MoreThan,
	MoreThanOrEqual,
	Not,
	Repository,
	FindOptionsWhere,
} from 'typeorm'
import _ from 'lodash'
import { TypeOrm } from './TypeOrm'
import { isNil, omitBy } from 'lodash'
import { ComparisonOperator, Enums, Env, getMySQLTimeInterval, Logger, SupportedCurrencies } from '@juicyllama/utils'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { ChartOptions, CurrencyOptions } from '../../types/typeorm'
import { ImportMode, BulkUploadResponse, ChartResult } from '../../types/common'

const logger = new Logger()

export class Query<T> {
	/**
	 * Perform a raw SQL query
	 * @param repository
	 * @param sql
	 */

	async raw(repository: Repository<T>, sql: string) {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][RAW][${repository.metadata.tableName}] ${sql}`)
		}
		return await repository.query(sql)
	}

	async create(repository: Repository<T>, data: DeepPartial<T>): Promise<T> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][CREATE][${repository.metadata.tableName}]`, data)
		}

		try {
			const record = repository.create(data)
			const result = await repository.save(record)

			if (Env.IsNotProd()) {
				logger.debug(`[QUERY][CREATE][${repository.metadata.tableName}] Result`, result)
			}

			return result
		} catch (e: any) {
			return await this.handleCreateError(e, repository, data)
		}
	}

	/**
	 * Upsert a record
	 * @param repository
	 * @param data
	 */

	async upsert(repository: Repository<T>, data: DeepPartial<T>, dedup_field: string): Promise<InsertResult> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][UPSERT][${repository.metadata.tableName}]`, data)
		}

		const fields: string[] = []

		for (const field of Object.keys(data)) {
			if (field === dedup_field) continue
			fields.push(field)
		}

		return await repository
			.createQueryBuilder()
			.insert()
			.into(repository.metadata.tableName)
			.values(data)
			.orUpdate(fields, [dedup_field])
			.execute()
	}

	async bulk(
		repository: Repository<T>,
		data: DeepPartial<T>[],
		import_mode: ImportMode,
		dedup_field?: string,
	): Promise<BulkUploadResponse> {
		logger.debug(`[QUERY][BULK][${repository.metadata.tableName}][${import_mode}]`, {
			data: {
				records: data.length,
				first_record: data[0],
				last_record: data[data.length - 1],
			},
		})

		let result: BulkUploadResponse

		switch (import_mode) {
			case ImportMode.CREATE:
				result = await this.createBulkRecords(repository, data)
				break

			case ImportMode.UPSERT:
				if (!dedup_field) {
					throw new Error('Dedup field required for update')
				}

				result = await this.upsertBulkRecords(repository, data, dedup_field)
				break

			case ImportMode.DELETE:
				if (!dedup_field) {
					throw new Error('Dedup field required for update')
				}
				result = await this.deleteBulkRecords(repository, data, dedup_field)
				break

			case ImportMode.REPOPULATE:
				await this.copyTable(repository)
				await this.truncate(repository)
				try {
					result = await this.createBulkRecords(repository, data)
					await this.dropTable(repository, `${repository.metadata.tableName}_COPY`)
				} catch (e: any) {
					logger.error(
						`[QUERY][BULK][${repository.metadata.tableName}][${import_mode}] ${e.message}`,
						e.stack,
					)
					await this.restoreTable(repository)
				}
				break
		}

		logger.debug(`[QUERY][BULK][${repository.metadata.tableName}][${import_mode}] Result`, result)
		return result
	}

	/**
	 * Find record by primary key id
	 * @param {Repository} repository
	 * @param {id} id
	 * @param {string[]} [relations]
	 */

	async findOneById(
		repository: Repository<T>,
		id: number,
		relations?: string[],
		currency?: CurrencyOptions,
	): Promise<T> {
		const where = {}
		where[this.getPrimaryKey(repository)] = id
		const result = <T>await this.findOne(repository, {
			where: where,
			relations: relations?.length ? relations : this.getRelations(repository),
		})
		return <T>await this.convertCurrency<T>(result, currency)
	}

	/**
	 * Find record by params
	 * @param {Repository} repository
	 * @param {FindOptionsWhere<T>[] | FindOptionsWhere<T>} where
	 * @param {FindManyOptions} options
	 */

	async findOneByWhere(
		repository: Repository<T>,
		where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
		options?: FindManyOptions,
		currency?: CurrencyOptions,
	): Promise<T> {
		options = TypeOrm.findOneOptionsWrapper<T>(repository, options)
		const result = <T>await this.findOne(repository, {
			...options,
			where: where,
		})
		return <T>await this.convertCurrency<T>(result, currency)
	}

	/**
	 * Find single record
	 * @param repository
	 * @param options
	 */

	async findOne(repository: Repository<T>, options?: FindOneOptions, currency?: CurrencyOptions): Promise<T> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}]`, { options: options })
		}

		options = TypeOrm.findOneOptionsWrapper<T>(repository, options)
		const result = <T>await repository.findOne(options)
		const convertedResult = <T>await this.convertCurrency<T>(result, currency)
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}] Result`, convertedResult)
		}
		return convertedResult
	}

	/**
	 * Find multiple records
	 * @param repository
	 * @param options
	 */

	async findAll(repository: Repository<T>, options?: FindManyOptions, currency?: CurrencyOptions): Promise<T[]> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][MANY][${repository.metadata.tableName}]`, { options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)
		const result = <T[]>await repository.find(options)
		return <T[]>await this.convertCurrency<T>(result, currency)
	}

	/**
	 * Update a record - must include primary_key for lookup
	 * @param repository
	 * @param data
	 */

	async update(repository: Repository<T>, data: DeepPartial<T>): Promise<T> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][UPDATE][${repository.metadata.tableName}]`, data)
		}

		if (!data[this.getPrimaryKey(repository)]) {
			throw new Error(
				`Primary key ${this.getPrimaryKey(repository)} missing from update to ${repository.metadata.tableName}`,
			)
		}

		try {
			await repository.update(data[this.getPrimaryKey(repository)], <any>data)
			return await this.findOneById(repository, data[this.getPrimaryKey(repository)])
		} catch (e) {
			return await this.handleUpdateError(e, repository, data)
		}
	}

	/**
	 * Counts records
	 * @param repository
	 * @param options
	 */

	async count(repository: Repository<T>, options?: FindManyOptions): Promise<number> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][COUNT][${repository.metadata.tableName}]`, { options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)
		return await repository.count(options)
	}

	/**
	 * Sum records
	 * @param repository
	 * @param metric
	 * @param options
	 */

	async sum(repository: Repository<T>, metric: string, options?: FindManyOptions): Promise<number> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][SUM][${repository.metadata.tableName}]`, { metric: metric, options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)

		const result = await repository
			.createQueryBuilder()
			.where(options.where)
			.select(`SUM(${metric}) as sum`)
			.execute()

		return Number(Number(result[0].sum).toFixed(2))
	}

	/**
	 * Avg records
	 * @param repository
	 * @param metric
	 * @param options
	 */

	async avg(repository: Repository<T>, metric: string, options?: FindManyOptions): Promise<number> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][AVG][${repository.metadata.tableName}]`, { metric: metric, options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)

		const result = await repository
			.createQueryBuilder()
			.where(options.where)
			.select(`AVG(${metric}) as average`)
			.execute()

		return Number(Number(result[0].average).toFixed(2))
	}

	/**
	 * Pie/line charts
	 * @param repository
	 * @param field
	 * @param options
	 */

	async charts(
		repository: Repository<T>,
		field: string,
		options: ChartOptions,
		currency?: CurrencyOptions,
	): Promise<ChartResult[]> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][CHARTS][${repository.metadata.tableName}]`, { field, options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)

		let queryBuilder: SelectQueryBuilder<T> = repository
			.createQueryBuilder()
			.select('COUNT(*)', 'count')
			.addSelect(field)

		if (currency?.currency && currency.currency_fields.includes(field)) {
			queryBuilder = queryBuilder.addSelect(currency.currency_field)
		}

		if (options.period) {
			queryBuilder = queryBuilder.addSelect(getMySQLTimeInterval(options.period), 'time_interval')
		}
		queryBuilder.where(options.where)
		if (options.from) {
			queryBuilder = queryBuilder.andWhere('created_at >= :from', { from: options.from })
		}
		if (options.to) {
			queryBuilder = queryBuilder.andWhere('created_at <= :to', { to: options.to })
		}

		queryBuilder = queryBuilder.groupBy(field)

		if (options.period) {
			queryBuilder = queryBuilder.addGroupBy('time_interval')
		}

		if (currency?.currency && currency.currency_fields.includes(field)) {
			queryBuilder = queryBuilder.addGroupBy(currency.currency_field)
		}

		const result = <ChartResult[]>await queryBuilder.getRawMany()

		// If its a currency we should sum and convert the results
		if (currency?.currency && currency.currency_fields.includes(field)) {
			const reduced: ChartResult[] = []

			for (const r of result) {
				const reducedIndex = reduced.findIndex(function (record) {
					return record.time_interval.toString() == r.time_interval.toString()
				})

				if (SupportedCurrencies[r[currency.currency_field]] !== SupportedCurrencies[currency.currency]) {
					r[field] = await currency.fxService.convert(
						r[field],
						SupportedCurrencies[r[currency.currency_field]],
						SupportedCurrencies[currency.currency],
						r.time_interval,
					)
				}

				if (reducedIndex === -1) {
					reduced.push({
						count: 1,
						[field]: Number(r[field]) * Number(r.count),
						time_interval: r.time_interval,
						currency: r.currency ?? null,
					})
				} else {
					reduced[reducedIndex][field] += Number(r[field]) * Number(r.count)
				}
			}
			return reduced
		}
		return result
	}

	/**
	 * Soft delete record
	 * @param repository
	 * @param record
	 */

	async remove(repository: Repository<T>, record: T): Promise<T> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][REMOVE][${repository.metadata.tableName}]`, record)
		}

		await repository.softRemove(record)
		return record
	}

	/**
	 * Purge record
	 * @param repository
	 * @param record
	 */

	async purge(repository: Repository<T>, record: T): Promise<void> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][PURGE][${repository.metadata.tableName}]`, record)
		}

		await repository.remove(record)
	}

	/**
	 * Remove all records form a table
	 * @param repository
	 */

	async truncate(repository: Repository<T>): Promise<void> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][TRUNCATE][${repository.metadata.tableName}]`)
		}

		const sql_delete = 'DELETE FROM ' + repository.metadata.tableName

		await this.raw(repository, sql_delete)

		const sql_auto_increment = 'ALTER TABLE ' + repository.metadata.tableName + ' AUTO_INCREMENT = 1'

		await this.raw(repository, sql_auto_increment)
	}

	/**
	 * Create a copy of a whole table
	 * @param repository
	 * @param table_name
	 */

	async copyTable(repository: Repository<T>, table_name?: string): Promise<void> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][COPY TABLE][${repository.metadata.tableName}]`)
		}

		await this.dropTable(repository, table_name ?? repository.metadata.tableName + '_COPY')

		const sql_copy = `CREATE TABLE ${table_name ?? repository.metadata.tableName + '_COPY'} LIKE ${
			repository.metadata.tableName
		}`

		await this.raw(repository, sql_copy)

		const sql_refill = `INSERT INTO ${table_name ?? repository.metadata.tableName + '_COPY'} SELECT * FROM ${
			repository.metadata.tableName
		}`

		await this.raw(repository, sql_refill)
	}

	/**
	 * Restore a table from a copy
	 * @param repository
	 * @param table_name
	 */

	async restoreTable(repository: Repository<T>, table_name?: string): Promise<void> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][RESTORE TABLE][${repository.metadata.tableName}]`)
		}

		const sql_rename = `RENAME TABLE ${repository.metadata.tableName} TO ${repository.metadata.tableName}_DELETE,
		${table_name ?? repository.metadata.tableName + '_COPY'} TO ${repository.metadata.tableName}`

		await this.raw(repository, sql_rename)
		await this.dropTable(repository, repository.metadata.tableName + '_DELETE')
	}

	/**
	 * Drop a table
	 * @param repository
	 * @param table_name
	 */

	async dropTable(repository: Repository<T>, table_name: string): Promise<void> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][DROP TABLE][${table_name}]`)
		}

		const sql_drop = `DROP TABLE IF EXISTS ${table_name}`
		await this.raw(repository, sql_drop)
	}

	getPrimaryKey(repository: Repository<T>) {
		return repository.metadata.columns.find(column => {
			if (column.isPrimary) {
				return column
			}
		}).propertyName
	}

	getTableName(repository: Repository<T>) {
		return repository.metadata.tableName
	}

	getRelations(repository: Repository<T>) {
		const result = {}

		const relations = repository.metadata.relations.map(column => {
			return column.propertyName
		})

		for (const r in relations) {
			result[relations[r]] = true
		}

		return result
	}

	getEventName(repository: Repository<T>, result: T): string {
		let event = ''

		if (result['account_id']) {
			event = `account_${result['account_id']}_`
		} else if (result['account']) {
			event = `account_${result['account'].account_id}_`
		} else if (result['user']) {
			event = `user_${result['user_id']}_`
		} else if (result['user']) {
			event = `user_${result['user'].user_id}_`
		}

		return (event += this.getTableName(repository))
	}

	private mapComparisonOperatorToTypeORMFindOperators<T>(op: ComparisonOperator, value: T): FindOperator<T> {
		switch (op) {
			case ComparisonOperator.GT:
				return MoreThan<T>(value)
			case ComparisonOperator.GTE:
				return MoreThanOrEqual<T>(value)
			case ComparisonOperator.LT:
				return LessThan<T>(value)
			case ComparisonOperator.LTE:
				return LessThanOrEqual<T>(value)
			case ComparisonOperator.EQ:
				return Equal<T>(value)
			case ComparisonOperator.NE:
				return Not<T>(Equal<T>(value))
			case ComparisonOperator.IS:
				return IsNull()
			case ComparisonOperator.NNULL:
				return Not<T>(IsNull())
			default:
				throw new Error('Unsupported operator ' + op)
		}
	}

	buildWhere(options: {
		repository: Repository<T>
		query?: any
		account_id?: number
		account_ids?: number[]
		search_fields?: string[]
	}): FindOptionsWhere<T>[] | FindOptionsWhere<T> {
		const where = []

		const whereBase = {}

		if (options.query) {
			for (const [key, value] of Object.entries(options.query)) {
				if (options.repository.metadata.columns.find(column => column.propertyName === key)) {
					// @ts-ignore
					const fieldLookupWhere: FindOperator<string>[] = _.castArray(value) // value may be a string or an array of strings
						.reduce((memo: FindOperator<string>[], currentValue: string) => {
							if (typeof currentValue !== 'string') return memo
							// checking if value is of the form "operator:value"
							const [operator, lookupValue] = splitStringByFirstColon(currentValue)
							const opKeyName =
								Enums.getKeyName(ComparisonOperator, operator.toUpperCase()) ||
								Enums.getKeyName(ComparisonOperator, ComparisonOperator[currentValue.toUpperCase()])
							if (opKeyName) {
								// if operator is a valid ComparisonOperator
								return [
									...memo,
									this.mapComparisonOperatorToTypeORMFindOperators(
										ComparisonOperator[opKeyName],
										lookupValue,
									),
								]
							}
							return memo
						}, [])
					whereBase[key] =
						fieldLookupWhere.length === 1
							? fieldLookupWhere[0]
							: fieldLookupWhere.length > 0
								? And(...fieldLookupWhere)
								: value // if no valid operator is found, return the value as is - backward compatibility
				}
			}
		}

		if (options.account_id) {
			if (options.repository.metadata.relations.find(column => column.propertyName === 'account')) {
				whereBase['account'] = {
					account_id: options.account_id,
				}
			} else if (options.repository.metadata.columns.find(column => column.propertyName === 'account_id')) {
				whereBase['account_id'] = options.account_id
			} else if (options.repository.metadata.relations.find(column => column.propertyName === 'accounts')) {
				whereBase['accounts'] = {
					account_id: options.account_id,
				}
			}
		}

		if (options.account_ids) {
			if (options.repository.metadata.relations.find(column => column.propertyName === 'account')) {
				whereBase['account'] = {
					account_id: In(options.account_ids),
				}
			} else if (options.repository.metadata.columns.find(column => column.propertyName === 'account_id')) {
				whereBase['account_id'] = In(options.account_ids)
			} else if (options.repository.metadata.relations.find(column => column.propertyName === 'accounts')) {
				whereBase['accounts'] = {
					account_id: In(options.account_ids),
				}
			}
		}

		if (options.query?.search?.length === 1 && options.query?.search[0] === 'undefined') {
			delete options.query.search
		}

		if (!options.query?.search || !options.search_fields) {
			return whereBase
		}

		if (options.query?.relations?.length === 1 && options.query?.relations[0] === 'undefined') {
			delete options.query.relations
		}

		for (const search in options.search_fields) {
			// behind the scenes typeORM converts the different array members to OR clauses, and ObjectLiterals to AND clauses
			where.push({
				...whereBase,
				[options.search_fields[search]]: Like(`%${options.query.search}%`),
			})
		}
		return where
	}

	findOneOptions(
		query: {
			select?: any
			relations?: any
		},
		where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
	) {
		if (query.select) {
			query.select = query.select.split(',')
		}

		if (query.relations) {
			query.relations = query.relations.split(',')
		}

		const options = {
			where: where,
			relations: query.relations ?? null,
			select: query.select ?? null,
		}

		return omitBy(options, isNil)
	}

	findOptions(
		query: {
			select?: any
			relations?: any
			limit?: number
			offset?: number
			order_by?: string
			order_by_type?: string
		},
		where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
		fallback_order_column?: string,
	): FindManyOptions<T> {
		if (query.select) {
			query.select = query.select.split(',')
		}

		if (query.relations) {
			query.relations = query.relations.split(',')
		}

		const options = {
			take: query.limit ?? 20,
			skip: query.offset ?? 0,
			order: query.order_by
				? { [query.order_by]: query.order_by_type ?? 'ASC' }
				: { [fallback_order_column ?? 'created_at']: 'DESC' },
			select: query.select ?? null,
			relations: query.relations ?? null,
			where: where,
		}

		return omitBy(options, isNil)
	}

	/**
	 * Duplicate key error
	 */

	async handleCreateError(e: any, repository: Repository<T>, data: DeepPartial<T>): Promise<T> {
		const logger = new Logger()

		if (e.message.startsWith('Duplicate entry')) {
			logger.warn(`[SQL][CREATE] Duplicate entry: ${e.message}`, {
				repository: {
					tableName: repository.metadata.tableName,
				},
				data: data,
				error: e,
			})

			const uniqueKeyWhere = {}

			for (const key of TypeOrm.getUniqueKeyFields(repository)) {
				uniqueKeyWhere[key] = data[key]
			}

			return this.findOne(repository, { where: uniqueKeyWhere })
		} else {
			logger.error(`[SQL][CREATE] Error: ${e.message}`, {
				repository: {
					tableName: repository.metadata.tableName,
				},
				data: data,
				error: {
					message: e.message,
					stack: e.stack,
				},
			})

			return undefined
		}
	}

	async handleUpdateError(e: any, repository: Repository<T>, data: DeepPartial<T>): Promise<T> {
		const logger = new Logger()

		if (e.message.startsWith('Duplicate entry')) {
			logger.warn(`[SQL][UPDATE] Duplicate entry: ${e.message}`, {
				repository: {
					tableName: repository.metadata.tableName,
				},
				data: data,
				error: e,
			})

			const uniqueKeyWhere = {}

			for (const key of TypeOrm.getUniqueKeyFields(repository)) {
				uniqueKeyWhere[key] = data[key]
			}

			return this.findOne(repository, { where: uniqueKeyWhere })
		} else {
			logger.error(`[SQL][UPDATE]  ${e.message}`, {
				repository: {
					tableName: repository.metadata.tableName,
				},
				data: data,
				error: {
					message: e.message,
					stack: e.stack,
				},
			})

			return undefined
		}
	}

	/**
	 * Inserts multiple records
	 */

	async createBulkRecords(repository: Repository<T>, data: DeepPartial<T>[]): Promise<BulkUploadResponse> {
		// due to performance issues adding thousands of records at once (with possible subscribers etc), we will insert records individually
		const result: BulkUploadResponse = {
			total: data.length,
			processed: 0,
			created: 0,
			updated: 0,
			deleted: 0,
			errored: 0,
			errors: [],
			ids: [],
		}

		for (const record of data) {
			try {
				const entity = await this.create(repository, record)
				result.ids.push(entity[this.getPrimaryKey(repository)])
				result.created++
			} catch (e: any) {
				result.errored++
				result.errors.push(e.message)
			}
			result.processed++
		}
		return result
	}

	async upsertBulkRecords(
		repository: Repository<T>,
		data: DeepPartial<T>[],
		dedup_field: string,
	): Promise<BulkUploadResponse> {
		// due to performance issues adding thousands of records at once (with possible subscribers etc), we will insert records individually

		const result: BulkUploadResponse = {
			total: data.length,
			processed: 0,
			created: 0,
			updated: 0,
			deleted: 0,
			errored: 0,
			errors: [],
			ids: [],
		}

		for (const record of data) {
			try {
				const r = await this.findOne(repository, {
					where: {
						[dedup_field]: record[dedup_field],
					},
				})

				const entity = await this.upsert(repository, record, dedup_field)

				if (r) {
					result.updated++
				} else {
					result.created++
				}
				result.ids.push(entity[this.getPrimaryKey(repository)])
			} catch (e: any) {
				result.errored++
				result.errors.push(e.message)
			}
			result.processed++
		}

		return result
	}

	/*
	 * Deletes records based on deduplicate fields
	 */

	async deleteBulkRecords(
		repository: Repository<T>,
		data: DeepPartial<T>[],
		dedup_field: string,
	): Promise<BulkUploadResponse> {
		const result: BulkUploadResponse = {
			total: data.length,
			processed: 0,
			created: 0,
			updated: 0,
			deleted: 0,
			errored: 0,
			errors: [],
		}

		const records: any[] = []

		for (const row of data) {
			records.push(row[dedup_field])
		}

		for (const record of data) {
			try {
				const r = await this.findOne(repository, <any>{
					where: {
						[dedup_field]: record[dedup_field],
					},
				})

				if (r) {
					await this.purge(repository, r)
					result.deleted++
				}
			} catch (e: any) {
				result.errored++
				result.errors.push(e.message)
			}
			result.processed++
		}

		return result
	}

	/**
	 * Converts currency_fields to a spcific currency
	 */

	async convertCurrency<T>(result: T | T[], currency?: CurrencyOptions): Promise<T | T[]> {
		if (
			!currency ||
			!currency.currency ||
			!currency.fxService ||
			!currency.currency_field ||
			!currency.currency_fields.length
		)
			return result

		const logger = new Logger()

		if (Array.isArray(result)) {
			logger.debug(`[QUERY][CONVERTCURRENCY] Converting ${result.length} Records to ${currency.currency}`, {
				currency_field: currency.currency_field,
				currency_fields: currency.currency_fields,
			})

			for (const r in result) {
				if (
					SupportedCurrencies[result[r][currency.currency_field]] !== SupportedCurrencies[currency.currency]
				) {
					for (const field of currency.currency_fields) {
						result[r][field] = await currency.fxService.convert(
							result[r][field],
							SupportedCurrencies[result[r][currency.currency_field]],
							SupportedCurrencies[currency.currency],
							result[r]['created_at'] ?? new Date(),
						)
					}
					result[r][currency.currency_field] = SupportedCurrencies[currency.currency]
				}
			}
			return <T[]>result
		} else {
			logger.debug(`[QUERY][CONVERTCURRENCY] Converting record to ${currency.currency}`, {
				currency_field: currency.currency_field,
				currency_fields: currency.currency_fields,
			})

			if (result[currency.currency_field] != SupportedCurrencies[currency.currency]) {
				for (const field of currency.currency_fields) {
					result[field] = await currency.fxService.convert(
						result[field],
						SupportedCurrencies[field[currency.currency_field]],
						SupportedCurrencies[currency.currency],
						result['created_at'] ?? new Date(),
					)
				}
				result[currency.currency_field] = SupportedCurrencies[currency.currency]
			}
			return <T>result
		}
	}
}

function splitStringByFirstColon(inputString: string): string[] {
	const indexOfFirstColon = inputString.indexOf(':')

	if (indexOfFirstColon !== -1) {
		const key = inputString.slice(0, indexOfFirstColon)
		const value = inputString.slice(indexOfFirstColon + 1)
		return [key, value]
	} else {
		return [inputString]
	}
}
