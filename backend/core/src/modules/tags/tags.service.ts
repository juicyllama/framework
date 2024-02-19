import { CachePeriod, JLCache } from '@juicyllama/utils'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { BaseService } from '../../helpers/baseService'
import { Query } from '../../utils/typeorm/Query'
import { BeaconService } from '../beacon/beacon.service'
import { Tag } from './tags.entity'

const cache_key = 'utils::tags'
const E = Tag
type T = Tag

@Injectable()
export class TagsService extends BaseService<T> {
	constructor(
		@Inject(Query) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		readonly beaconService: BeaconService,
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

	async findByName(name: string): Promise<T | null> {
		let tag: Tag | null = <Tag>await this.cacheManager.get(JLCache.cacheKey(cache_key, name))
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
