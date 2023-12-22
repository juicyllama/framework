import {
	Controller,
	forwardRef,
	Post,
	Inject,
	Param,
	Query,
	Req,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ChartsPeriod, ChartsResponseDto, StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { AccountId, AuthService, ReadManyDecorator, UserAuth, crudFindAll, 	Query as TQuery, ReadChartsDecorator, crudCharts, StorageService, crudStats, ReadStatsDecorator, ReadOneDecorator, crudFindOne, FxService } from '@juicyllama/core'
import { Invoice } from './invoices.entity'
import { InvoicesService } from './invoices.service'
import { InvoiceOrderBy, InvoiceRelations, InvoiceSelect } from './invoices.enums'
import { T, E, SEARCH_FIELDS, BILLING_INVOICES_NAME, ORDER_BY, PRIMARY_KEY, CURRENCY_FIELD, CURRENCY_FIELDS} from './invoices.constants'

@ApiTags('Invoices')
@UserAuth()
@Controller('billing/invoices')
export class InvoicesController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => InvoicesService)) private readonly service: InvoicesService,
		@Inject(forwardRef(() => StorageService)) readonly storageService: StorageService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<T>,
		@Inject(forwardRef(() => FxService)) private readonly fxService: FxService,
	) {}

	@ReadManyDecorator({
		name: BILLING_INVOICES_NAME,
		entity: E,
		selectEnum: InvoiceSelect,
		orderByEnum: InvoiceOrderBy,
		relationsEnum: InvoiceRelations,
		currency_field: CURRENCY_FIELD,
		currency_fields: CURRENCY_FIELDS,
	})
	async findAll(@Req() req, @Query() query, @AccountId() account_id: number): Promise<T[]> {
		await this.authService.check(req.user.user_id, account_id)
		return await crudFindAll<T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: SEARCH_FIELDS,
			order_by: ORDER_BY,
			currency: {
				fxService: this.fxService,
				currency_field: CURRENCY_FIELD,
				currency_fields: CURRENCY_FIELDS,
			},
		})
	}

	@ReadStatsDecorator({ name: BILLING_INVOICES_NAME })
	async stats(
		@Req() req,
		@Query() query,
		@Query('method') method: StatsMethods,
		@AccountId() account_id: number,
	): Promise<StatsResponseDto> {
		await this.authService.check(req.user.user_id, account_id)
		return await crudStats<T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: SEARCH_FIELDS,
		})
	}

	@ReadChartsDecorator({
		entity: E,
		name: BILLING_INVOICES_NAME,
		selectEnum: InvoiceSelect,
		currency_field: CURRENCY_FIELD,
		currency_fields: CURRENCY_FIELDS,
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
		return await crudCharts<T>({
			service: this.service,
			tQuery: this.tQuery,
			query,
			search,
			period,
			fields,
			...(from && { from: new Date(from) }),
			...(to && { to: new Date(to) }),
			searchFields: SEARCH_FIELDS,
			currency: {
				fxService: this.fxService,
				currency_field: CURRENCY_FIELD,
				currency_fields: CURRENCY_FIELDS,
			},
		})
	}

	@ReadOneDecorator({
		entity: E,
		name: BILLING_INVOICES_NAME,
		selectEnum: InvoiceSelect,
		relationsEnum: InvoiceRelations,
		primaryKey: PRIMARY_KEY,
		currency_field: CURRENCY_FIELD,
		currency_fields: CURRENCY_FIELDS,
	})
	async findOne(
		@Req() req,
		@Param() params,
		@AccountId() account_id: number,
		@Query() query,
	): Promise<Invoice> {
		await this.authService.check(req.user.user_id, account_id)
		return await crudFindOne<T>({
			service: this.service,
			query: query,
			primaryKey: params[PRIMARY_KEY],
			account_id: account_id,
			currency: {
				fxService: this.fxService,
				currency_field: CURRENCY_FIELD,
				currency_fields: CURRENCY_FIELDS,
			},
		})
	}

	@ApiOperation({ summary: `Download invoice file` })
	@Post(`/download/:invoice_id`)
	async uploadAvatarFile(@Req() req, @AccountId() invoice_id: number, @AccountId() account_id: number): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)
		return await this.service.downloadInvoice(req.user, invoice_id)
	}

	
}
