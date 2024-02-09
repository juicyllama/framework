import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Chat } from './chat.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

const E = Chat
type T = Chat

@Injectable()
export class ChatService extends BaseService<T> {
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
