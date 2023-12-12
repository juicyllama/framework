import { MoreThan, Repository, ColumnType } from 'typeorm'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere'
import { isNil, omitBy } from 'lodash'
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions'

export class TypeOrm {
	/**
	 * Helper function to:
	 * * At controller level, take query, where and other settings and convert it to a FindManyOptions object
	 */
	static findOptions<T>(
		query: any,
		where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
		default_sort: string,
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
			order: query.order_by ? { [query.order_by]: query.order_by_type ?? 'ASC' } : { [default_sort]: 'ASC' },
			select: query.select ?? null,
			relations: query.relations ?? null,
			where: where,
		}

		return omitBy(options, isNil)
	}

	static findOneOptions<T>(query: any, where: FindOptionsWhere<T>[] | FindOptionsWhere<T>): FindOneOptions<T> {
		if (query.select) {
			query.select = query.select.split(',')
		}

		if (query.relations) {
			query.relations = query.relations.split(',')
		}

		const options = {
			select: query.select ?? null,
			relations: query.relations ?? null,
			where: where,
		}

		return omitBy(options, isNil)
	}

	/**
	 * Helper function to:
	 *  * Make sure the options are formatted correctly
	 *  * Filter out invalid select values
	 */

	static findAllOptionsWrapper<T>(repository: Repository<T>, options?: FindManyOptions): FindManyOptions {
		options = this.handleEmptyOptions(repository, options)
		options = this.handleEmptyWhere(repository, options)
		options = this.handleEmptyRelations(repository, options)
		options = this.filterOutInvalidSelectValues(repository, options)
		return options
	}

	static findOneOptionsWrapper<T>(repository: Repository<T>, options?: FindManyOptions): FindManyOptions {
		options = this.handleEmptyOptions(repository, options)
		options = this.handleEmptyRelations(repository, options)
		options = this.filterOutInvalidSelectValues(repository, options)
		return options
	}

	static filterOutInvalidSelectValues<T>(repository: Repository<T>, options: FindManyOptions): FindManyOptions {
		if (options?.select) {
			options.select = <string[]>options.select
			const validSelectValues = repository.metadata.columns.map(column => column.propertyName)
			options.select = options.select.filter((select: string) => validSelectValues.includes(select))
		}
		return options
	}

	static handleEmptyOptions<T>(repository: Repository<T>, options?: FindManyOptions) {
		if (!options) {
			options = {
				where: {
					[this.getPrimaryKey(repository)]: MoreThan(0),
				},
				order: {
					created_at: 'DESC',
				},
			}
		}

		return options
	}

	static handleEmptyWhere<T>(repository: Repository<T>, options?: FindManyOptions) {
		if (options) {
			if (!options.where) {
				options.where = {
					[this.getPrimaryKey(repository)]: MoreThan(0),
				}
			}
		}

		return options
	}

	static handleEmptyRelations<T>(repository: Repository<T>, options?: FindManyOptions) {
		const relations = repository.metadata.relations.map(relation => relation.propertyName)

		if (!options?.relations) {
			options.relations = relations
		}

		return options
	}

	/** Returns the table name of a given repository */

	static getTableName<T>(repository: Repository<T>) {
		return repository.metadata.tableName
	}

	/**
	 * Returns the primary key of the given repository
	 */

	static getPrimaryKey<T>(repository: Repository<T>) {
		return repository.metadata.columns.find(column => {
			if (column.isPrimary) {
				return column
			}
		}).propertyName
	}

	/**
	 * Returns a unique list of column names for the given repository
	 */

	static getColumnNames<T>(repository: Repository<T>): string[] {
		const columns = repository.metadata.columns.map(column => {
			return column.propertyName
		})

		return columns
	}

	/**
	 * Return the column type for the given column name
	 */

	static getColumnType<T>(repository: Repository<T>, column: string): ColumnType {
		return repository.metadata.columns.find(e => e.propertyName === column).type
	}

	/**
	 * Return true if column can be null
	 */

	static isColumnNullable<T>(repository: Repository<T>, column: string): boolean {
		return repository.metadata.columns.find(e => e.propertyName === column).isNullable
	}

	/**
	 * Returns unique key fields for the given repository
	 */

	static getUniqueKeyFields<T>(repository: Repository<T>): string[] {
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
}
