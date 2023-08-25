import {
	And,
	DeepPartial,
	Equal,
	FindManyOptions,
	FindOneOptions,
	FindOperator,
	In,
	IsNull,
	LessThan,
	LessThanOrEqual,
	Like,
	MoreThan,
	MoreThanOrEqual,
	Not,
	Repository,
} from 'typeorm'
import { TypeOrm } from './TypeOrm'
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere'
import _, { isNil, omitBy } from 'lodash'
import { ComparisonOperator, Enums, Env, getMySQLTimeInterval, Logger } from '@juicyllama/utils'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { ChartOptions } from './types'
import { ResultSetHeader } from 'mysql2'

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
			return await repository.save(record)
		} catch (e) {
			return await this.handleCreateError(e, repository, data)
		}
	}

	async bulkInsert(repository: Repository<T>, data: DeepPartial<T>[]): Promise<ResultSetHeader> {
		const inserts: string[] = []

		for (const row of data) {
			const values = Object.values(row)
				.map((v: string) => `'${v.replace("'", "\\'")}'`)
				.join(', ')
			inserts.push(`(${values})`)
		}
		return this.raw(
			repository,
			`INSERT INTO ${repository.metadata.tableName} (${Object.keys(data[0]).join(',')}) VALUES ` +
				inserts.join(', '),
		)
	}

	/**
	 * Find record by primary key id
	 * @param {Repository} repository
	 * @param {id} id
	 * @param {string[]} [relations]
	 */

	async findOneById(repository: Repository<T>, id: number, relations?: string[]): Promise<T> {
		const where = {}
		where[this.getPrimaryKey(repository)] = id
		return this.findOne(repository, {
			where: where,
			relations: relations?.length ? relations : this.getRelations(repository),
		})
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
	): Promise<T> {
		options = TypeOrm.findOneOptionsWrapper<T>(repository, options)
		return this.findOne(repository, {
			...options,
			where: where,
		})
	}

	/**
	 * Find single record
	 * @param repository
	 * @param options
	 */

	findOne(repository: Repository<T>, options?: FindOneOptions): Promise<T> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][ONE][${repository.metadata.tableName}]`, { options: options })
		}

		options = TypeOrm.findOneOptionsWrapper<T>(repository, options)
		return repository.findOne(options)
	}

	/**
	 * Find multiple records
	 * @param repository
	 * @param options
	 */

	findAll(repository: Repository<T>, options?: FindManyOptions): Promise<T[]> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][FIND][MANY][${repository.metadata.tableName}]`, { options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)
		return repository.find(options)
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

	async charts(repository: Repository<T>, field: string, options: ChartOptions): Promise<any> {
		if (Env.IsNotProd()) {
			logger.debug(`[QUERY][CHARTS][${repository.metadata.tableName}]`, { field, options: options })
		}

		options = TypeOrm.findAllOptionsWrapper<T>(repository, options)

		let queryBuilder: SelectQueryBuilder<T> = repository
			.createQueryBuilder()
			.select('COUNT(*)', 'count')
			.addSelect(field)
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
		return queryBuilder.getRawMany()
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
			}
		}

		if (options.account_ids) {
			if (options.repository.metadata.relations.find(column => column.propertyName === 'account')) {
				whereBase['account'] = {
					account_id: In(options.account_ids),
				}
			} else if (options.repository.metadata.columns.find(column => column.propertyName === 'account_id')) {
				whereBase['account_id'] = In(options.account_ids)
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
	 * Returns unique key fields for the given repository
	 */

	getUniqueKeyFields(repository: Repository<T>): string[] {
		const uniques: string[] = []

		if (repository.metadata.indices.length) {
			if (repository.metadata.indices[0]?.columnNamesWithOrderingMap) {
				for (const [key] of Object.entries(repository.metadata.indices[0]?.columnNamesWithOrderingMap)) {
					uniques.push(key)
				}
			}
		}

		if (uniques.length) {
			return uniques
		}

		const unqiueKeys: string[] = repository.metadata.uniques.map(e => e.givenColumnNames[0])
		if (unqiueKeys.length) {
			return unqiueKeys
		}

		return []
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

			for (const key of this.getUniqueKeyFields(repository)) {
				uniqueKeyWhere[key] = data[key]
			}

			return this.findOne(repository, { where: uniqueKeyWhere })
		} else {
			logger.error(`[SQL][CREATE] ${e.message}`, {
				repository: {
					tableName: repository.metadata.tableName,
				},
				data: data,
				error: e,
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

			for (const key of this.getUniqueKeyFields(repository)) {
				uniqueKeyWhere[key] = data[key]
			}

			return this.findOne(repository, { where: uniqueKeyWhere })
		} else {
			logger.error(`[SQL][UPDATE]  ${e.message}`, {
				repository: {
					tableName: repository.metadata.tableName,
				},
				data: data,
				error: e,
			})

			return undefined
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
