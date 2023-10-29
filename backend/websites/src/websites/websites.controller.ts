import { Body, Controller, forwardRef, Inject, Param, Query, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { WebsitesService } from './websites.service'
import {
	Query as TQuery,
	AccountId,
	AuthService,
	CreateDecorator,
	crudDelete,
	crudFindAll,
	crudFindOne,
	crudStats,
	crudUpdate,
	DeleteDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UpdateDecorator,
	UserAuth,
	crudCreate,
	UserRole,
} from '@juicyllama/core'
import { CreateWebsiteDto, UpdateWebsiteDto } from './websites.dto'
import { WebsiteOrderBy, WebsiteRelations, WebsiteSelect } from './websites.enums'
import {
	WEBSITES_T,
	WEBSITES_E,
	WEBSITES_NAME,
	WEBSITES_PRIMARY_KEY,
	WEBSITES_SEARCH_FIELDS,
	WEBSITES_DEFAULT_ORDER_BY,
} from './websites.constants'

@ApiTags('Websites')
@UserAuth()
@Controller('websites/website')
export class WebsitesController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => WebsitesService)) private readonly service: WebsitesService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<WEBSITES_T>,
	) {}

	@CreateDecorator(WEBSITES_E, WEBSITES_NAME)
	async create(@Req() req, @Body() data: CreateWebsiteDto, @AccountId() account_id: number): Promise<WEBSITES_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudCreate<WEBSITES_T>({
			service: this.service,
			data: data,
			account_id: account_id,
		})
	}

	@ReadManyDecorator(WEBSITES_E, WebsiteSelect, WebsiteOrderBy, WebsiteRelations, WEBSITES_NAME)
	async findAll(@Query() query, @AccountId() account_id: number): Promise<WEBSITES_T[]> {
		return await crudFindAll<WEBSITES_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: WEBSITES_SEARCH_FIELDS,
			order_by: WEBSITES_DEFAULT_ORDER_BY,
		})
	}

	@ReadStatsDecorator(WEBSITES_NAME)
	async stats(
		@Query() query,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<StatsResponseDto> {
		return await crudStats<WEBSITES_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: WEBSITES_SEARCH_FIELDS,
		})
	}

	@ReadOneDecorator(WEBSITES_E, WEBSITES_PRIMARY_KEY, WebsiteSelect, WebsiteRelations, WEBSITES_NAME)
	async findOne(@AccountId() account_id: number, @Param() params, @Query() query): Promise<WEBSITES_T> {
		return await crudFindOne<WEBSITES_T>({
			service: this.service,
			query: query,
			primaryKey: params[WEBSITES_PRIMARY_KEY],
			account_id: account_id,
		})
	}

	@UpdateDecorator(WEBSITES_E, WEBSITES_PRIMARY_KEY, WEBSITES_NAME)
	async update(
		@Req() req,
		@AccountId() account_id: number,
		@Body() data: UpdateWebsiteDto,
		@Param() params,
	): Promise<WEBSITES_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudUpdate<WEBSITES_T>({
			service: this.service,
			data: data,
			primaryKey: params[WEBSITES_PRIMARY_KEY],
		})
	}

	@DeleteDecorator(WEBSITES_E, WEBSITES_PRIMARY_KEY, WEBSITES_NAME)
	async remove(@Req() req, @Param() params, @AccountId() account_id: number): Promise<WEBSITES_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudDelete<WEBSITES_T>({
			service: this.service,
			primaryKey: params[WEBSITES_PRIMARY_KEY],
			account_id: account_id,
		})
	}
}
