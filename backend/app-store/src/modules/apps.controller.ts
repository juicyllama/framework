import {
	AccountId,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UserAuth,
	Query as TQuery,
	AuthService,
	BaseController,
	ControllerOptionalProps,
} from '@juicyllama/core'
import { StatsMethods } from '@juicyllama/utils'
import { forwardRef, Inject, Param, Query, Controller, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { APP_T as T } from './apps.constants'
import { AppsService as Service } from './apps.service'
import { appConstants as constants } from './apps.constants'

@ApiTags('Apps')
@UserAuth()
@Controller('/apps/store')
export class AppsController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
		@Inject(forwardRef(() => Service)) readonly service: Service,
	) {
		super(service, tQuery, constants, <ControllerOptionalProps>{
			services: {
				authService,
			},
		})
	}

	@ReadManyDecorator(constants)
	async findAll(@Req() req: AuthenticatedRequest, @Query() query: any, @AccountId() account_id: number): Promise<T[]> {
		return super.findAll(req, query, account_id)
	}

	@ReadStatsDecorator(constants)
	async stats(
		@Req() req: AuthenticatedRequest,
		@Query() query: any,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<any> {
		return super.stats(req, query, account_id, method)
	}

	@ReadOneDecorator(constants)
	async findOne(@Req() req: AuthenticatedRequest, @AccountId() account_id: number, @Param() params: any, @Query() query: any): Promise<T> {
		return super.findOne(req, account_id, params, query)
	}
}
