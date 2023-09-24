import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Query, BaseService, BeaconService } from '@juicyllama/core'
import { Shortlink } from './shortlinks.entity.js'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

type T = Shortlink
const E = Shortlink

@Injectable()
export class ShortlinksService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}
}
