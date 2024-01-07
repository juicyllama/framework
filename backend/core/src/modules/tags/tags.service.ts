import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { Tag } from './tags.entity.js'
import { Cache } from 'cache-manager'
import { CachePeriod, JLCache } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query.js'
import { BaseService } from '../../helpers/baseService.js'
import { BeaconService } from '../beacon/beacon.service.js'

const cache_key = 'utils::tags'
const E = Tag
type T = Tag

@Injectable()
export class TagsService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {
		super(query, repository, {
			beacon: beaconService,
			cache: {
				cacheManager: cacheManager,
				field: 'name',
				ttl: CachePeriod.MONTH,
			},
		})
	}

	async findByName(name: string): Promise<T> {
		let tag = <Tag>await this.cacheManager.get(JLCache.cacheKey(cache_key, name))
		if (tag) return tag

		tag = await this.repository.findOne({
			where: { name: name },
		})

		if (tag) {
			await this.cacheManager.set(JLCache.cacheKey(cache_key, name), tag, CachePeriod.HOUR)
		}

		return tag
	}

	async createFromStrings(tags: string[]): Promise<T[]> {
		const newTags: T[] = []
		for (const tag of tags) {
			const newTag = await super.create({
				name: tag,
			})
			newTags.push(newTag)
		}
		return newTags
	}

	async findUnused(): Promise<T[]> {
		//todo check business logic tables we add tags to (.e.g. transactions/etc)
		// create query once added
		return await super.findAll({
			where: {
				tag_id: MoreThanOrEqual(1),
			},
		})
	}
}
