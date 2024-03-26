import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StockLocation } from './locations.entity'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { CachePeriod, JLCache } from '@juicyllama/utils'

const E = StockLocation
type T = StockLocation
const cache_key = 'ecommerce::stock::locations'

@Injectable()
export class StockLocationsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(Query) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {
		super(query, repository, {
			beacon: beaconService,
			cache: {
				cacheManager,
				field: 'ext_id',
				ttl: CachePeriod.MONTH,
			},
		})
	}

	async findByExtId(ext_id: string): Promise<T | null> {
		let location: T | null = <T>await this.cacheManager.get(JLCache.cacheKey(cache_key, ext_id))
		if (location) return location

		location = await this.repository.findOne({
			where: { ext_id },
		})

		if (location) {
			await this.cacheManager.set(JLCache.cacheKey(cache_key, ext_id), location, CachePeriod.MONTH)
		}

		return location
	}
}
