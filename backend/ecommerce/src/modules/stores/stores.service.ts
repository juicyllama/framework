import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Store } from './stores.entity'

const E = Store
type T = Store

@Injectable()
export class StoresService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(Query) readonly query: Query<T>,
		readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}
}
