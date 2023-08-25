import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Subscription } from './subscriptions.entity'
import { BaseService, Query } from '@juicyllama/core'

const E = Subscription
type T = Subscription
@Injectable()
export class SubscriptionsService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
	) {
		super(query, repository)
	}
}
