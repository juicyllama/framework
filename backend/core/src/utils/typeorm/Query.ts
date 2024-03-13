import { ComparisonOperator, Enums, Env, Logger, SupportedCurrencies, getMySQLTimeInterval } from '@juicyllama/utils'
import { castArray, isNil, omitBy } from 'lodash'
import {
	And,
	DeepPartial,
	Equal,
	FindManyOptions,
	FindOneOptions,
	FindOperator,
	FindOptionsWhere,
	FindOptionsWhereProperty,
	In,
	InsertResult,
	IsNull,
	LessThan,
	LessThanOrEqual,
	Like,
	MoreThan,
	MoreThanOrEqual,
	Not,
	ObjectLiteral,
	Repository,
} from 'typeorm'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { BulkUploadResponse, ChartResult, ImportMode } from '../../types/common'
import { ChartOptions, CurrencyOptions } from '../../types/typeorm'
import { Entries, TypeOrm } from './TypeOrm'

const logger = new Logger()

export class Query<T extends ObjectLiteral> {
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
			this.logCreateError(e, repository, data)
			throw e
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

		let result: BulkUploadResponse | undefined = undefined

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
			default:
				throw new Error(`${import_mode} is not a supported import mode`)
		}

		if (!result) {
			throw new Error('Failed to upsert')
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
		currency?: CurrencyOptions<T>,
	): Promise<T> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}]`, {
				[this.getPrimaryKey(repository)]: id,
			})
		}

		const where: FindOptionsWhere<T> = {}
		where[this.getPrimaryKey(repository)] = <T[keyof T]>id

		let result = <T>await this.findOne(repository, {
			where: where,
			relations: relations?.length ? relations : this.getRelations(repository),
		})
		result = <T>await this.convertCurrency(result, currency)

		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}] Result`, result)
		}

		return result
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
		currency?: CurrencyOptions<T>,
	): Promise<T> {
		options = TypeOrm.findOneOptionsWrapper<T>(repository, options)

		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}]`, { options: options })
		}

		let result = <T>await this.findOne(repository, {
			...options,
			where: where,
		})
		result = <T>await this.convertCurrency(result, currency)

		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}] Result`, result)
		}

		return result
	}

	/**
	 * Find single record
	 * @param repository
	 * @param options
	 */

	async findOne(repository: Repository<T>, options?: FindOneOptions, currency?: CurrencyOptions<T>): Promise<T> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}]`, { options: options })
		}

		options = TypeOrm.findOneOptionsWrapper<T>(repository, options)
		let result = <T>await repository.findOne(options)
		result = <T>await this.convertCurrency(result, currency)

		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}] Result`, result)
		}

		return result
	}

	/**
	 * Find multiple records
	 * @param repository
	 * @param options
	 */

	async findAll(repository: Repository<T>, options?: FindManyOptions, currency?: CurrencyOptions<T>): Promise<T[]> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][MANY][${repository.metadata.tableName}]`, { options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)
		let result = <T[]>await repository.find(options)
		result = <T[]>await this.convertCurrency(result, currency)

		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][MANY][${repository.metadata.tableName}] Result`, {
				first: result[0],
				last: result[result.length - 1],
			})
		}

		return result
	}

	/**
	 * Update a record - must include primary_key for lookup
	 * @param repository
	 * @param data
	 * @param relations - specify any relations you would like to return with the result
	 */

	async update(repository: Repository<T>, data: DeepPartial<T>, relations: string[] = []): Promise<T> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][UPDATE][${repository.metadata.tableName}]`, data)
		}

		if (!data[this.getPrimaryKey(repository)]) {
			throw new Error(
				`Primary key ${<string>this.getPrimaryKey(repository)} missing from update to ${
					repository.metadata.tableName
				}`,
			)
		}

		try {
			await repository.update(data[this.getPrimaryKey(repository)], <any>data)
			return await this.findOneById(repository, data[this.getPrimaryKey(repository)], relations)
		} catch (e) {
			this.logUpdateError(e, repository, data)
			throw e
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

	async sum(repository: Repository<T>, metric: string, options?: FindManyOptions<T>): Promise<number> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][SUM][${repository.metadata.tableName}]`, { metric: metric, options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)

		const result = await repository
			.createQueryBuilder() // @ts-ignore: options.where is FindOptionsWhere which is actually a valid ObjectLiteral
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

	async avg(repository: Repository<T>, metric: string, options?: FindManyOptions<T>): Promise<number> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][AVG][${repository.metadata.tableName}]`, { metric: metric, options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)

		const result = await repository
			.createQueryBuilder() // @ts-ignore options.where is FindOptionsWhere which is actually a valid ObjectLiteral
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
		currency?: CurrencyOptions<T>,
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
		// @ts-ignore options.where is FindOptionsWhere which is actually a valid ObjectLiteral
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

				if (
					SupportedCurrencies[<keyof typeof SupportedCurrencies>r[currency.currency_field]] !==
					SupportedCurrencies[currency.currency]
				) {
					r[field] = await currency.fxService.convert(
						r[field],
						r[currency.currency_field],
						currency.currency,
						r.time_interval,
					)
				}

				if (reducedIndex === -1) {
					reduced.push({
						count: 1,
						[field]: Number(r[field]) * Number(r.count),
						time_interval: r.time_interval,
						currency: r.currency,
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

	getPrimaryKey(repository: Repository<T>): keyof DeepPartial<T> {
		const pk = repository.metadata.columns.find(column => {
			if (column.isPrimary) {
				return column
			}
		})?.propertyName
		if (!pk) {
			throw new Error('no primary key was found')
		}
		return <keyof DeepPartial<T>>pk
	}

	getTableName(repository: Repository<T>) {
		return repository.metadata.tableName
	}

	getRelations(repository: Repository<T>): Record<string, boolean> {
		const result: Record<string, boolean> = {}

		const relations: string[] = repository.metadata.relations.map(column => {
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
		} else if (result['user_id']) {
			event = `user_${result['user_id']}_`
		} else if (result['user']) {
			event = `user_${result['user'].user_id}_`
		}

		return (event += this.getTableName(repository))
	}

	requiresAccountId(repository: Repository<T>): Boolean {
		return !!repository.metadata.columns.find(column => {
			if (column.propertyName === 'account_id') {
				return column
			}
		})
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
		query?: Partial<Record<'search' | keyof T | string, string | string[]>>
		account_id?: number
		account_ids?: number[]
		search_fields?: string[]
	}): FindOptionsWhere<T>[] | FindOptionsWhere<T> {
		const where = []
		const relationsProperty = options.repository.metadata.relations.map(relation => relation.propertyName)

		let whereBase: FindOptionsWhere<T> = {}
		const entries: Entries<T> = Object.entries(options.query ?? {}) as Entries<T>
		if (options.query) {
			for (const [key, value] of entries) {
				const isRelation = (key as string).includes('.')
				const k = isRelation ? (key as string).split('.')[0] : key
				if (
					options.repository.metadata.columns.find(column => column.propertyName === k) ||
					relationsProperty.find(r => r === k)
				) {
					// @ts-ignore
					const fieldLookupWhere: FindOperator<string>[] = castArray(value) // value may be a string or an array of strings
						.reduce((memo: FindOperator<string>[], currentValue: keyof typeof ComparisonOperator) => {
							if (typeof currentValue !== 'string') return memo
							// checking if value is of the form "operator:value"
							const [operator, lookupValue] = splitStringByFirstColon(currentValue)
							const opKeyName =
								Enums.getKeyName(ComparisonOperator, operator.toUpperCase()) || // @ts-ignore
								Enums.getKeyName(ComparisonOperator, ComparisonOperator[currentValue.toUpperCase()])
							if (opKeyName) {
								// if operator is a valid ComparisonOperator
								return [
									...memo,
									this.mapComparisonOperatorToTypeORMFindOperators(
										ComparisonOperator[<keyof typeof ComparisonOperator>opKeyName],
										lookupValue,
									),
								]
							}
							return memo
						}, [])

					const queryValue =
						fieldLookupWhere.length === 1
							? (fieldLookupWhere[0] as keyof T extends 'toString'
									? unknown
									: FindOptionsWhereProperty<NonNullable<T[keyof T]>, NonNullable<T[keyof T]>>)
							: fieldLookupWhere.length > 0
								? (And(...fieldLookupWhere) as keyof T extends 'toString'
										? unknown
										: FindOptionsWhereProperty<NonNullable<T[keyof T]>, NonNullable<T[keyof T]>>)
								: (value as keyof T extends 'toString'
										? unknown
										: FindOptionsWhereProperty<NonNullable<T[keyof T]>, NonNullable<T[keyof T]>>)
					if (isRelation) {
						whereBase = {
							...whereBase,
							...this.createWhereRelations(key as string, queryValue as string, relationsProperty),
						}
					} else {
						whereBase = { ...whereBase, [key]: queryValue } as FindOptionsWhere<T>
					}
				}
			}
		}

		whereBase = this.includeAccount(whereBase, options)

		if (options.query?.search?.length === 1 && options.query?.search[0] === 'undefined') {
			delete options.query.search
		}

		if (!options.query?.search || !options.search_fields) {
			return whereBase
		}

		if (options.query?.relations?.length === 1 && options.query?.relations[0] === 'undefined') {
			delete options.query.relations
		}

		for (const search of options.search_fields) {
			// behind the scenes typeORM converts the different array members to OR clauses, and ObjectLiterals to AND clauses
			let whereToMerge = {}
			if (search.includes('.')) {
				whereToMerge = {
					...whereToMerge,
					...this.createWhereRelations(search, Like(`%${options.query.search}%`), relationsProperty),
				}
			} else {
				whereToMerge = { ...whereToMerge, [search]: Like(`%${options.query.search}%`) }
			}
			where.push({
				...whereBase,
				...whereToMerge,
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

	logCreateError(e: any, repository: Repository<T>, data: DeepPartial<T>): void {
		const logger = new Logger()

		if (e.message.startsWith('Duplicate entry')) {
			logger.warn(`[SQL][CREATE] Duplicate entry: ${e.message}`, {
				repository: {
					tableName: repository.metadata.tableName,
				},
				data: data,
				error: e,
			})
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
		}
	}

	logUpdateError(e: any, repository: Repository<T>, data: DeepPartial<T>): void {
		const logger = new Logger()

		if (e.message.startsWith('Duplicate entry')) {
			logger.warn(`[SQL][UPDATE] Duplicate entry: ${e.message}`, {
				repository: {
					tableName: repository.metadata.tableName,
				},
				data: data,
				error: e,
			})
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
				result.errors ||= []
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
						[dedup_field]: record[dedup_field as keyof DeepPartial<T>],
					},
				})

				const res = await this.upsert(repository, record, dedup_field)

				if (r) {
					result.updated++
				} else {
					result.created++
				}

				result.ids.push(res.identifiers[0][this.getPrimaryKey(repository).toString()])
			} catch (e: any) {
				result.errored++
				result.errors ||= []
				logger.debug(`[QUERY][UPSERT][${repository.metadata.tableName}] Error`, e)
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
			ids: [],
		}

		const records: any[] = []

		for (const row of data) {
			records.push(row[dedup_field as keyof DeepPartial<T>])
		}

		for (const record of data) {
			try {
				const r = await this.findOne(repository, <any>{
					where: {
						[dedup_field]: record[dedup_field  as keyof DeepPartial<T>],
					},
				})

				if (r) {
					await this.purge(repository, r)
					result.deleted++
				}
			} catch (e: any) {
				result.errored++
				result.errors ||= []
				result.errors.push(e.message)
			}
			result.processed++
		}

		return result
	}

	/**
	 * Converts currency_fields to a spcific currency
	 */

	async convertCurrency(result: T | T[], currency?: CurrencyOptions<T>): Promise<T | T[]> {
		if (
			!currency ||
			!currency.currency ||
			!currency.fxService ||
			!currency.currency_field ||
			!currency.currency_fields.length
		)
			return result

		const logger = new Logger()

		logger.debug(
			`[QUERY][CONVERTCURRENCY] Converting ${castArray(result).length} Records to ${currency.currency}`,
			{
				currency_field: currency.currency_field,
				currency_fields: currency.currency_fields,
			},
		)

		for (const record of castArray(result)) {
			if (
				SupportedCurrencies[<keyof typeof SupportedCurrencies>record[currency.currency_field]] !==
				SupportedCurrencies[currency.currency]
			) {
				for (const field of currency.currency_fields) {
					const converted: number = await currency.fxService.convert(
						record[field],
						record[currency.currency_field],
						SupportedCurrencies[currency.currency],
						record['created_at'] ?? new Date(),
					)
					// @ts-ignore
					record[field] = converted
				}
				record[currency.currency_field] = SupportedCurrencies[currency.currency]
			}
		}
		return result
	}

	/**
	 * Expands any lang fields
	 */

	includeAccount(
		whereBase: any,
		options: {
			repository: Repository<T>
			query?: any
			account_id?: number
			account_ids?: number[]
			search_fields?: string[]
		},
	): any {
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

		return whereBase
	}

	private createWhereRelations(
		keyString: string,
		value: string | FindOperator<string>,
		relations: string[],
	): FindOptionsWhere<T> {
		const keys = keyString.split('.')

		const result: { [key: string]: string | {} } = {}
		if (!relations.includes(keys[0])) {
			return result as FindOptionsWhere<T>
		}

		let current = result

		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i]
			current = current[key] = {}
		}

		current[keys[keys.length - 1]] = value
		return result as FindOptionsWhere<T>
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
