import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Activity } from './activity.entity'

const E = Activity
type T = Activity

@Injectable()
export class ActivityService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(Query) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async incrementStreak(activity_identifier: string, user_id: number): Promise<T> {
		const activity = await super.findOne({
			where: {
				activity_identifier,
				user_id: user_id,
			},
		})

		if (!activity) {
			return await super.create({
				activity_identifier,
				user_id: user_id,
				streak: 1,
			})
		}

		if (activity.streak) {
			return await super.update({
				activity_id: activity.activity_id,
				streak: activity.streak + 1,
			})
		} else {
			return await super.update({
				activity_id: activity.activity_id,
				streak: 1,
			})
		}
	}

	async resetStreak(activity_identifier: string, user_id: number): Promise<Activity | undefined> {
		const activity = await super.findOne({
			where: {
				activity_identifier,
				user_id,
			},
		})

		if (!activity) {
			return
		}

		return await super.update({
			activity_id: activity.activity_id,
			streak: 0,
		})
	}
}
