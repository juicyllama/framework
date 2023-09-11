import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, FindOneOptions, MoreThanOrEqual, Repository } from 'typeorm'
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions'
import { Tag } from './tags.entity'
import { Cache } from 'cache-manager'
import { CachePeriod, JLCache } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query'

const cache_key = 'utils::tags'
const E = Tag
type T = Tag

@Injectable()
export class TagsService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async createFromStrings(tags: string[]): Promise<T[]> {
		const newTags: T[] = []
		for (const tag of tags) {
			const newTag = await this.create(tag)
			newTags.push(newTag)
		}
		return newTags
	}

	async create(name: string): Promise<T> {
		const tag = await this.findByName(name.toUpperCase())

		if (tag) return tag

		return await this.query.create(this.repository, { name: name.toUpperCase() })
	}

	async findAll(options?: FindManyOptions): Promise<T[]> {
		return await this.query.findAll(this.repository, options)
	}

	async findOne(options?: FindOneOptions): Promise<T> {
		return await this.query.findOne(this.repository, options)
	}

	async findById(id: number, relations?: string[]): Promise<T> {
		return await this.query.findOneById(this.repository, id, relations)
	}

	async findUnused(): Promise<T[]> {
		//todo check business logic tables we add tags to (.e.g. transactions/etc)
		// create query once added
		return await this.findAll({
			where: {
				tag_id: MoreThanOrEqual(1),
			},
		})
	}

	async findByName(name: string): Promise<T> {
		let tag = <Tag>await this.cacheManager.get(JLCache.cacheKey(cache_key, name.toUpperCase()))
		if (tag) return tag

		tag = await this.repository.findOne({
			where: { name: name.toUpperCase() },
		})

		if (tag) {
			await this.cacheManager.set(JLCache.cacheKey(cache_key, name.toUpperCase()), tag, CachePeriod.HOUR)
		}

		return tag
	}

	async count(options?: FindManyOptions): Promise<number> {
		return await this.query.count(this.repository, options)
	}

	async update(data: DeepPartial<T>): Promise<T> {
		return await this.query.update(this.repository, data)
	}

	async purge(tag: T): Promise<void> {
		return await this.query.purge(this.repository, tag)
	}
}
