import {
	AccountId,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UserAuth,
	Query as TQuery,
	crudFindAll,
	crudStats,
	crudFindOne,
} from '@juicyllama/core'
import { StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { forwardRef, Inject, Param, Query, Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { APP_DEFAULT_ORDER_BY, APP_E, APP_NAME, APP_PRIMARY_KEY, APP_SEARCH_FIELDS, APP_T } from './apps.constants'
import { AppsService } from './apps.service'
import { AppOrderBy, AppSelect } from './apps.enums'

@ApiTags('Apps')
@UserAuth()
@Controller('/apps/store')
export class AppsController {
	constructor(
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<APP_T>,
		@Inject(forwardRef(() => AppsService)) private readonly service: AppsService,
	) {}

	@ReadManyDecorator({ entity: APP_E, selectEnum: AppSelect, orderByEnum: AppOrderBy, name: APP_NAME })
	async findAll(@AccountId() account_id: number, @Query() query): Promise<APP_T[]> {
		return await crudFindAll<APP_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: APP_SEARCH_FIELDS,
			order_by: APP_DEFAULT_ORDER_BY,
		})
	}

	@ReadStatsDecorator({ name: APP_NAME })
	async stats(
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

	@ReadOneDecorator({ entity: APP_E, primaryKey: APP_PRIMARY_KEY, selectEnum: AppSelect, name: APP_NAME })
	async findOne(@Param() params, @Query() query): Promise<APP_T> {
		return await crudFindOne<APP_T>({
			service: this.service,
			query: query,
			primaryKey: params[APP_PRIMARY_KEY],
		})
	}
}
