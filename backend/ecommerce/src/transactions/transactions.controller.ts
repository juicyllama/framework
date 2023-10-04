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
	UserRole
} from '@juicyllama/core'
import { CreateTransactionDto, UpdateTransactionDto } from './transactions.dto'
import { TransactionOrderBy, TransactionRelations, TransactionSelect } from './transactions.enums'
import { TRANSACTION_T, TRANSACTION_E, TRANSACTION_NAME, TRANSACTION_PRIMARY_KEY, TRANSACTION_SEARCH_FIELDS, TRANSACTION_DEFAULT_ORDER_BY } from './transactions.constants'

@ApiTags('Transactions')
@UserAuth()
@Controller('ecommerce/transactions')
export class TransactionsController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => TransactionsService)) private readonly service: TransactionsService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<TRANSACTION_T>,
	) {}

	@CreateDecorator(TRANSACTION_E, TRANSACTION_NAME)
	async create(@Req() req, @Body() data: CreateTransactionDto, @AccountId() account_id: number): Promise<TRANSACTION_T> {
		
				//todo check if account has access to store_id
		
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudCreate<TRANSACTION_T>({
			service: this.service,
			data: data,
		})
	}

	@ReadManyDecorator(TRANSACTION_E, TransactionSelect, TransactionOrderBy, TransactionRelations)
	async findAll(@Query() query, @AccountId() account_id: number): Promise<TRANSACTION_T[]> {
	
		return await crudFindAll<TRANSACTION_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: TRANSACTION_SEARCH_FIELDS,
			order_by: TRANSACTION_DEFAULT_ORDER_BY,
		})
	}

	@ReadStatsDecorator(TRANSACTION_NAME)
	async stats(
		@Query() query,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<StatsResponseDto> {
		return await crudStats<TRANSACTION_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: TRANSACTION_SEARCH_FIELDS,
		})
	}

	@ReadOneDecorator(TRANSACTION_E, TRANSACTION_PRIMARY_KEY, TransactionSelect, TransactionRelations, TRANSACTION_NAME)
	async findOne(@AccountId() account_id: number, @Param() params, @Query() query): Promise<TRANSACTION_T> {
		return await crudFindOne<TRANSACTION_T>({
			service: this.service,
			query: query,
			primaryKey: params[TRANSACTION_PRIMARY_KEY],
			account_id: account_id,
		})
	}

	@UpdateDecorator(TRANSACTION_E, TRANSACTION_PRIMARY_KEY, TRANSACTION_NAME)
	async update(
		@Req() req,
		@AccountId() account_id: number,
		@Body() data: UpdateTransactionDto,
		@Param() params,
	): Promise<TRANSACTION_T> {

		//if store_id => todo check if account has access to store_id

		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudUpdate<TRANSACTION_T>({
			service: this.service,
			data: data,
			primaryKey: params[TRANSACTION_PRIMARY_KEY],
		})
	}

	@DeleteDecorator(TRANSACTION_E, TRANSACTION_PRIMARY_KEY, TRANSACTION_NAME)
	async remove(@Req() req, @Param() params, @AccountId() account_id: number): Promise<TRANSACTION_T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudDelete<TRANSACTION_T>({
			service: this.service,
			primaryKey: params[TRANSACTION_PRIMARY_KEY],
			account_id: account_id,
		})
	}
}
