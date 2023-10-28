import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { TransactionDiscount } from './discounts.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

const E = TransactionDiscount
type T = TransactionDiscount

@Injectable()
export class TransactionDiscountsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}
}
