import {
	Body,
	Controller,
	forwardRef,
	Inject,
	Param,
	Query,
	Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { StoresService } from './stores.service'
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
	UserRole
} from '@juicyllama/core'
import { CreateStoreDto, UpdateStoreDto } from './stores.dto'
import { StoreOrderBy, StoreRelations, StoreSelect } from './stores.enums'
import { STORE_T, STORE_E, STORE_NAME, STORE_PRIMARY_KEY, STORE_SEARCH_FIELDS, STORE_DEFAULT_ORDER_BY } from './stores.constants'

@ApiTags('Stores')
@UserAuth()
@Controller('ecommerce/stores')
export class StoresController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => StoresService)) private readonly service: StoresService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<STORE_T>,
	) {}

	@CreateDecorator(STORE_E, STORE_NAME)
	async create(@Req() req, @Body() data: CreateStoreDto, @AccountId() account_id: number): Promise<STORE_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudCreate<STORE_T>({
			service: this.service,
			data: data,
			account_id: account_id,
		})
	}

	@ReadManyDecorator(STORE_E, StoreSelect, StoreOrderBy, StoreRelations)
	async findAll(@Query() query, @AccountId() account_id: number): Promise<STORE_T[]> {
		return await crudFindAll<STORE_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: STORE_SEARCH_FIELDS,
			order_by: STORE_DEFAULT_ORDER_BY,
		})
	}

	@ReadStatsDecorator(STORE_NAME)
	async stats(
		@Query() query,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<StatsResponseDto> {
		return await crudStats<STORE_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: STORE_SEARCH_FIELDS,
		})
	}

	@ReadOneDecorator(STORE_E, STORE_PRIMARY_KEY, StoreSelect, StoreRelations, STORE_NAME)
	async findOne(@AccountId() account_id: number, @Param() params, @Query() query): Promise<STORE_T> {
		return await crudFindOne<STORE_T>({
			service: this.service,
			query: query,
			primaryKey: params[STORE_PRIMARY_KEY],
			account_id: account_id,
		})
	}

	@UpdateDecorator(STORE_E, STORE_PRIMARY_KEY, STORE_NAME)
	async update(
		@Req() req,
		@AccountId() account_id: number,
		@Body() data: UpdateStoreDto,
		@Param() params,
	): Promise<STORE_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudUpdate<STORE_T>({
			service: this.service,
			data: data,
			primaryKey: params[STORE_PRIMARY_KEY],
		})
	}

	@DeleteDecorator(STORE_E, STORE_PRIMARY_KEY, STORE_NAME)
	async remove(@Req() req, @Param() params, @AccountId() account_id: number): Promise<STORE_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudDelete<STORE_T>({
			service: this.service,
			primaryKey: params[STORE_PRIMARY_KEY],
			account_id: account_id,
		})
	}
}
