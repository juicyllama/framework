import { Controller, forwardRef, Inject, Param, Req, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import {
	Query as TQuery,
	AccountId,
	AuthService,
	UserAuth,
	BaseController,
	AuthenticatedRequest,
} from '@juicyllama/core'
import { pointsConstants as constants, POINTS_T as T } from './points.constants'
import { PointsService } from './points.service'

@ApiTags('Points')
@UserAuth()
@Controller('social/points/:points_identifier')
export class PointsController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => PointsService)) readonly service: PointsService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
		})
	}

	@ApiOperation({ summary: 'Get Points' })
	@Get()
	async getPoints(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('points_identifier') points_identifier: string,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		return await this.service.findOne({
			where: [
				{
					points_identifier,
					user_id: req.user.user_id,
				},
			],
		})
	}
}
