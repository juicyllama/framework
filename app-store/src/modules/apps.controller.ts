import {
	AccountId,
	AccountService,
	AuthService,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UserAuth,
	UsersService,
	Query as TQuery,
	crudFindAll,
	crudStats,
	crudFindOne,
} from '@juicyllama/core'
import { StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { forwardRef, Inject, Param, Req, Query, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { APP_DEFAULT_ORDER_BY, APP_E, APP_NAME, APP_PRIMARY_KEY, APP_SEARCH_FIELDS, APP_T } from './apps.constants'
import { AppsService } from './apps.service'
import { AppOrderBy, AppSelect } from './apps.enums'

@ApiTags('Apps')
@UserAuth()
@Controller('/apps/store')
export class AppsController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<APP_T>,
		@Inject(forwardRef(() => AppsService)) private readonly service: AppsService,
	) {}

	@ReadManyDecorator(APP_E, AppSelect, AppOrderBy, null, APP_NAME)
	async findAll(@Req() req, @AccountId() account_id: number, @Query() query): Promise<APP_T[]> {
		return await crudFindAll<APP_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: APP_SEARCH_FIELDS,
			order_by: APP_DEFAULT_ORDER_BY,
		})
	}

	@ReadStatsDecorator(APP_NAME)
	async stats(
		@Req() req,
		@AccountId() account_id: number,
		@Query() query,
		@Query('method') method?: StatsMethods,
	): Promise<StatsResponseDto> {
		return await crudStats<APP_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: APP_SEARCH_FIELDS,
		})
	}

	@ReadOneDecorator(APP_E, APP_PRIMARY_KEY, AppSelect, null, APP_NAME)
	async findOne(@Req() req, @Param() params, @Query() query): Promise<APP_T> {
		return await crudFindOne<APP_T>({
			service: this.service,
			query: query,
			primaryKey: params[APP_PRIMARY_KEY],
		})
	}
}
