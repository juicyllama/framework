import {
	Body,
	Controller,
	forwardRef,
	Inject,
	Param,
	Req,
	Get,
	Put,
	Patch,
	Delete,
	BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import {
	Query as TQuery,
	AccountId,
	AuthService,
	UserAuth,
	BaseController,
	AuthenticatedRequest,
} from '@juicyllama/core'
import { ActivityService } from './activity.service'
import { PutActivityDto } from './activity.dtos'
import { activityConstants as constants, ACTIVITY_T as T } from './activity.constants'

@ApiTags('Activity')
@UserAuth()
@Controller('social/activity')
export class ActivityController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => ActivityService)) readonly service: ActivityService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
		})
	}

	@ApiOperation({ summary: 'Increment Streak' })
	@Patch('/streak/:activity_identifier')
	async incrementStreak(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('activity_identifier') activity_identifier: string,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)
		return await this.service.incrementStreak(activity_identifier, req.user.user_id)
	}

	@ApiOperation({ summary: 'Reset Streak' })
	@Delete('/streak/:activity_identifier')
	async resetStreak(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('activity_identifier') activity_identifier: string,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)
		const activity = await this.service.resetStreak(activity_identifier, req.user.user_id)

		if (!activity) {
			throw new BadRequestException(
				`No streak found for this user with activity_identifier = ${activity_identifier}`,
			)
		}

		return activity
	}

	@ApiOperation({ summary: 'Get Activity' })
	@Get('/:activity_identifier')
	async getOne(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('activity_identifier') activity_identifier: string,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		return await this.service.findOne({
			where: {
				activity_identifier,
				user_id: req.user.user_id,
			},
		})
	}

	@ApiOperation({ summary: 'Put Activity' })
	@Put('/:activity_identifier')
	async update(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('activity_identifier') activity_identifier: string,
		@Body() body: PutActivityDto,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		const activity = await this.service.findOne({
			where: {
				activity_identifier,
				user_id: req.user.user_id,
			},
		})

		if (!activity) {
			return await this.service.create({
				activity_identifier,
				user_id: req.user.user_id,
				...body,
			})
		}

		return await this.service.update({
			activity_id: activity.activity_id,
			...body,
		})
	}
}
