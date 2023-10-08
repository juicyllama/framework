import { forwardRef, Inject, Injectable } from '@nestjs/common'
import {
	BeaconService,
	Query,
	BaseService,
} from '@juicyllama/core'
import { Website } from './websites.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

const E = Website
type T = Website

@Injectable()
export class WebsitesService extends BaseService<T> {
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
