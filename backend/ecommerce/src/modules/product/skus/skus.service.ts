import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Sku } from './sku.entity'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { CachePeriod, JLCache } from '@juicyllama/utils'

const E = Sku
type T = Sku
const cache_key = 'ecommerce::skus'
const cache_period = CachePeriod.MONTH

@Injectable()
export class SkusService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(Query) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {
		super(query, repository, {
			beacon: beaconService,
			cache: {
				cacheManager: cacheManager,
				field: 'sku',
				ttl: cache_period,
			},
		})
	}

	async findBySku(sku: string): Promise<T | null> {
		let result: Sku | null = <Sku>await this.cacheManager.get(JLCache.cacheKey(cache_key, sku))
		if (result) return result

		result = await this.repository.findOne({
			where: { sku: sku },
		})

		if (result) {
			await this.cacheManager.set(JLCache.cacheKey(cache_key, sku), result, cache_period)
		}

		return result
	}
}
