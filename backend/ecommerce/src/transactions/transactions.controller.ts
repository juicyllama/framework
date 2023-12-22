import { BadRequestException, Body, Controller, forwardRef, Inject, Param, Query, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChartsPeriod, ChartsResponseDto, StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { TransactionsService } from './transactions.service'
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
	ReadChartsDecorator,
	crudCharts,
	FxService,
} from '@juicyllama/core'
import { CreateTransactionDto, UpdateTransactionDto } from './transactions.dto'
import { TransactionOrderBy, TransactionRelations, TransactionSelect } from './transactions.enums'
import {
	TRANSACTION_T,
	TRANSACTION_E,
	TRANSACTION_NAME,
	TRANSACTION_PRIMARY_KEY,
	TRANSACTION_SEARCH_FIELDS,
	TRANSACTION_DEFAULT_ORDER_BY,
	TRANSACTION_CURRENCY_FIELD,
	TRANSACTION_CURRENCY_FIELDS,
} from './transactions.constants'
import { StoresService } from '../stores/stores.service'

@ApiTags('Transactions')
@UserAuth()
@Controller('ecommerce/transactions')
export class TransactionsController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => TransactionsService)) private readonly service: TransactionsService,
		@Inject(forwardRef(() => StoresService)) private readonly storesService: StoresService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<TRANSACTION_T>,
		@Inject(forwardRef(() => FxService)) private readonly fxService: FxService,
	) {}

	@CreateDecorator({ entity: TRANSACTION_E, name: TRANSACTION_NAME })
	async create(
		@Req() req,
		@Body() data: CreateTransactionDto,
		@AccountId() account_id: number,
	): Promise<TRANSACTION_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		await this.storeAuth(account_id, data.store_id)

		return await crudCreate<TRANSACTION_T>({
			service: this.service,
			data: data,
			account_id: account_id,
		})
	}

	@ReadManyDecorator({
		entity: TRANSACTION_E,
		name: TRANSACTION_NAME,
		selectEnum: TransactionSelect,
		orderByEnum: TransactionOrderBy,
		relationsEnum: TransactionRelations,
		currency_field: TRANSACTION_CURRENCY_FIELD,
		currency_fields: TRANSACTION_CURRENCY_FIELDS,
	})
	async findAll(@Req() req, @Query() query, @AccountId() account_id: number): Promise<TRANSACTION_T[]> {
		await this.authService.check(req.user.user_id, account_id)
		return await crudFindAll<TRANSACTION_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: TRANSACTION_SEARCH_FIELDS,
			order_by: TRANSACTION_DEFAULT_ORDER_BY,
			currency: {
				fxService: this.fxService,
				currency_field: TRANSACTION_CURRENCY_FIELD,
				currency_fields: TRANSACTION_CURRENCY_FIELDS,
			},
		})
	}

	@ReadStatsDecorator({ name: TRANSACTION_NAME })
	async stats(
		@Req() req, 
		@Query() query,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<StatsResponseDto> {
		await this.authService.check(req.user.user_id, account_id)
		return await crudStats<TRANSACTION_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: TRANSACTION_SEARCH_FIELDS,
		})
	}

	@ReadChartsDecorator({
		entity: TRANSACTION_E,
		name: TRANSACTION_NAME,
		selectEnum: TransactionSelect,
		currency_field: TRANSACTION_CURRENCY_FIELD,
		currency_fields: TRANSACTION_CURRENCY_FIELDS,
	})
	async charts(
		@Req() req, 
		@AccountId() account_id: number,
		@Query() query: any,
		@Query('search') search: string,
		@Query('from') from: string,
		@Query('to') to: string,
		@Query('fields') fields: string[],
		@Query('period') period?: ChartsPeriod,
	): Promise<ChartsResponseDto> {
		await this.authService.check(req.user.user_id, account_id)
		return await crudCharts<TRANSACTION_T>({
			service: this.service,
			tQuery: this.tQuery,
			query,
			search,
			period,
			fields,
			...(from && { from: new Date(from) }),
			...(to && { to: new Date(to) }),
			searchFields: TRANSACTION_SEARCH_FIELDS,
			currency: {
				fxService: this.fxService,
				currency_field: TRANSACTION_CURRENCY_FIELD,
				currency_fields: TRANSACTION_CURRENCY_FIELDS,
			},
		})
	}

	@ReadOneDecorator({
		entity: TRANSACTION_E,
		name: TRANSACTION_NAME,
		selectEnum: TransactionSelect,
		relationsEnum: TransactionRelations,
		primaryKey: TRANSACTION_PRIMARY_KEY,
		currency_field: TRANSACTION_CURRENCY_FIELD,
		currency_fields: TRANSACTION_CURRENCY_FIELDS,
	})
	async findOne(@Req() req, @AccountId() account_id: number, @Param() params, @Query() query): Promise<TRANSACTION_T> {
		await this.authService.check(req.user.user_id, account_id)
		return await crudFindOne<TRANSACTION_T>({
			service: this.service,
			query: query,
			primaryKey: params[TRANSACTION_PRIMARY_KEY],
			account_id: account_id,
			currency: {
				fxService: this.fxService,
				currency_field: TRANSACTION_CURRENCY_FIELD,
				currency_fields: TRANSACTION_CURRENCY_FIELDS,
			},
		})
	}

	@UpdateDecorator({
		entity: TRANSACTION_E,
		name: TRANSACTION_NAME,
		primaryKey: TRANSACTION_PRIMARY_KEY,
	})
	async update(
		@Req() req,
		@AccountId() account_id: number,
		@Body() data: UpdateTransactionDto,
		@Param() params,
	): Promise<TRANSACTION_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])

		const transaction = await this.service.findById(params[TRANSACTION_PRIMARY_KEY])

		if (!transaction) {
			throw new BadRequestException('Transaction not found')
		}

		await this.storeAuth(account_id, transaction.store_id)

		return await crudUpdate<TRANSACTION_T>({
			service: this.service,
			data: data,
			account_id: account_id,
			primaryKey: params[TRANSACTION_PRIMARY_KEY],
		})
	}

	@DeleteDecorator({
		entity: TRANSACTION_E,
		name: TRANSACTION_NAME,
		primaryKey: TRANSACTION_PRIMARY_KEY,
	})
	async remove(@Req() req, @Param() params, @AccountId() account_id: number): Promise<TRANSACTION_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudDelete<TRANSACTION_T>({
			service: this.service,
			primaryKey: params[TRANSACTION_PRIMARY_KEY],
			account_id: account_id,
		})
	}

	private async storeAuth(account_id: number, store_id: number) {
		const store = await this.storesService.findOne({
			where: {
				account_id: account_id,
				store_id: store_id,
			},
		})

		if (!store) {
			throw new BadRequestException('Store not found')
		}
	}
}
