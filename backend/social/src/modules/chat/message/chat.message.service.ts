import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatMessage } from './chat.message.entity'

const E = ChatMessage
type T = ChatMessage

@Injectable()
export class ChatMessageService extends BaseService<T> {
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
