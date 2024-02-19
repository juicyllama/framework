import { BaseService, BeaconService, Query } from '@juicyllama/core'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Log } from './logs.entity'

export const E = Log
export type T = Log

@Injectable()
export class LogsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		readonly query: Query<T>,
		readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}
}
