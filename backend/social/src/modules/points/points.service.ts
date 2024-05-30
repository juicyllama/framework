import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Points } from './points.entity'
import { PointLogService } from './log/points.log.service'

const E = Points
type T = Points

@Injectable()
export class PointsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(Query) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => PointLogService)) readonly pointLogService: PointLogService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async addPoints(options: {
		points_identifier: string
		user_id: number
		points: number
		log?: string
	}): Promise<Points> {
		return await this.changePoints(options)
	}

	async subtractPoints(options: {
		points_identifier: string
		user_id: number
		points: number
		log?: string
	}): Promise<Points> {
		return await this.changePoints({
			...options,
			points: -options.points,
		})
	}

	private async changePoints(options: {
		points_identifier: string
		user_id: number
		points: number
		log?: string
	}): Promise<Points> {
		let pointsEntity = await super.findOne({
			where: {
				points_identifier: options.points_identifier,
				user_id: options.user_id,
			},
		})

		const pointsLog = {
			log: options.log,
		}

		if (pointsEntity) {
			if (options.log) {
				await this.pointLogService.create({
					points_id: pointsEntity.points_id,
					...pointsLog,
					points_before: pointsEntity.points,
					points_change: options.points,
					points_after: pointsEntity.points + options.points,
				})
			}

			await super.update({
				points_id: pointsEntity.points_id,
				points: (pointsEntity.points += options.points),
			})
		} else {
			pointsEntity = await super.create({
				points_identifier: options.points_identifier,
				user_id: options.user_id,
				points: options.points,
			})

			if (options.log) {
				const log = await this.pointLogService.create({
					points_id: pointsEntity.points_id,
					...pointsLog,
					points_before: 0,
					points_change: options.points,
					points_after: options.points,
				})

				pointsEntity.logs = [log]
			}
		}

		return pointsEntity
	}
}
