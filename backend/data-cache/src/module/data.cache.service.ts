import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Repository, DeepPartial, FindOptionsWhere, FindManyOptions } from 'typeorm'
import { Query } from '@juicyllama/core'

@Injectable()
export class DataCacheService<T> {
	constructor(@Inject(forwardRef(() => Query)) private readonly query: Query<T>) {}

	async set(repository: Repository<T>, data: DeepPartial<T>): Promise<T> {
		return await this.query.create(repository, data)
	}

	async get(
		repository: Repository<T>,
		where: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
		options?: FindManyOptions,
	) {
		return this.query.findOneByWhere(repository, where, options)
	}
}
