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
import { StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { Controller, Inject, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
	TRANSACTION_DISCOUNT_T,
	TRANSACTION_DISCOUNT_E,
	TRANSACTION_DISCOUNT_NAME,
	TRANSACTION_DISCOUNT_PRIMARY_KEY,
	TRANSACTION_DISCOUNT_SEARCH_FIELDS,
	TRANSACTION_DISCOUNT_DEFAULT_ORDER_BY,
} from './discounts.constants'
import { TransactionDiscountOrderBy, TransactionDiscountRelations, TransactionDiscountSelect } from './discounts.enums'
import { TransactionDiscountsService } from './discounts.service'

@ApiTags('Discounts')
@UserAuth()
@Controller('ecommerce/transactions/discounts')
export class TransactionDiscountsController {
	constructor(
		private readonly service: TransactionDiscountsService,
		@Inject(TQuery) private readonly tQuery: TQuery<TRANSACTION_DISCOUNT_T>,
	) {}

	@ReadManyDecorator({
		entity: TRANSACTION_DISCOUNT_E,
		name: TRANSACTION_DISCOUNT_NAME,
		selectEnum: TransactionDiscountSelect,
		orderByEnum: TransactionDiscountOrderBy,
		relationsEnum: TransactionDiscountRelations,
	})
	async findAll(@Query() query: any, @AccountId() account_id: number): Promise<TRANSACTION_DISCOUNT_T[]> {
		return await crudFindAll<TRANSACTION_DISCOUNT_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: TRANSACTION_DISCOUNT_SEARCH_FIELDS,
			order_by: TRANSACTION_DISCOUNT_DEFAULT_ORDER_BY,
		})
	}

	@ReadStatsDecorator({ name: TRANSACTION_DISCOUNT_NAME })
	async stats(
		@Query() query: any,
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

	@ReadOneDecorator({
		entity: TRANSACTION_DISCOUNT_E,
		name: TRANSACTION_DISCOUNT_NAME,
		selectEnum: TransactionDiscountSelect,
		relationsEnum: TransactionDiscountRelations,
		primaryKey: TRANSACTION_DISCOUNT_PRIMARY_KEY,
	})
	async findOne(
		@AccountId() account_id: number,
		@Param() params: any,
		@Query() query: any,
	): Promise<TRANSACTION_DISCOUNT_T> {
		return await crudFindOne<TRANSACTION_DISCOUNT_T>({
			service: this.service,
			query: query,
			primaryKey: params[TRANSACTION_DISCOUNT_PRIMARY_KEY],
			account_id: account_id,
		})
	}
}
