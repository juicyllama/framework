import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService, BeaconService, Query } from '@juicyllama/core'
import { App } from './apps.entity'
import { AppStoreIntegrationName } from './apps.enums'
export const E = App
export type T = App
@Injectable()
export class AppsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async findByAppName(integration_name: AppStoreIntegrationName): Promise<T | undefined> {
		return await super.findOne({ where: { integration_name } })
	}
}
