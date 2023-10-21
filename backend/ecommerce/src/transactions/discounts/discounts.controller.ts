import {
	Controller,
	forwardRef,
	Inject,
	Param,
	Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { TransactionDiscountsService } from './discounts.service'
import {
	Query as TQuery,
	AccountId,
	crudFindAll,
	crudFindOne,
	crudStats,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UserAuth,
} from '@juicyllama/core'
import { TransactionDiscountOrderBy, TransactionDiscountRelations, TransactionDiscountSelect } from './discounts.enums'
import { TRANSACTION_DISCOUNT_T, TRANSACTION_DISCOUNT_E, TRANSACTION_DISCOUNT_NAME, TRANSACTION_DISCOUNT_PRIMARY_KEY, TRANSACTION_DISCOUNT_SEARCH_FIELDS, TRANSACTION_DISCOUNT_DEFAULT_ORDER_BY } from './discounts.constants'

@ApiTags('Discounts')
@UserAuth()
@Controller('ecommerce/transactions/discounts')
export class TransactionDiscountsController {
	constructor(
		@Inject(forwardRef(() => TransactionDiscountsService)) private readonly service: TransactionDiscountsService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<TRANSACTION_DISCOUNT_T>,
	) {}

	@ReadManyDecorator(TRANSACTION_DISCOUNT_E, TransactionDiscountSelect, TransactionDiscountOrderBy, TransactionDiscountRelations)
	async findAll(@Query() query, @AccountId() account_id: number): Promise<TRANSACTION_DISCOUNT_T[]> {
		return await crudFindAll<TRANSACTION_DISCOUNT_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: TRANSACTION_DISCOUNT_SEARCH_FIELDS,
			order_by: TRANSACTION_DISCOUNT_DEFAULT_ORDER_BY,
		})
	}

	@ReadStatsDecorator(TRANSACTION_DISCOUNT_NAME)
	async stats(
		@Query() query,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<StatsResponseDto> {
		return await crudStats<TRANSACTION_DISCOUNT_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: TRANSACTION_DISCOUNT_SEARCH_FIELDS,
		})
	}

	@ReadOneDecorator(TRANSACTION_DISCOUNT_E, TRANSACTION_DISCOUNT_PRIMARY_KEY, TransactionDiscountSelect, TransactionDiscountRelations, TRANSACTION_DISCOUNT_NAME)
	async findOne(@AccountId() account_id: number, @Param() params, @Query() query): Promise<TRANSACTION_DISCOUNT_T> {
		return await crudFindOne<TRANSACTION_DISCOUNT_T>({
			service: this.service,
			query: query,
			primaryKey: params[TRANSACTION_DISCOUNT_PRIMARY_KEY],
			account_id: account_id,
		})
	}
}
