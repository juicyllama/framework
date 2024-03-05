import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Oauth } from './oauth.entity'
import { BaseService, BeaconService, Query } from '@juicyllama/core'

export const E = Oauth
export type T = Oauth

@Injectable()
export class OauthService extends BaseService<T> {
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
