import { Controller, forwardRef, Post, Inject, Param, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ChartsPeriod, ChartsResponseDto, StatsMethods } from '@juicyllama/utils'
import {
	AccountId,
	AuthService,
	ReadManyDecorator,
	UserAuth,
	Query as TQuery,
	ReadChartsDecorator,
	ReadStatsDecorator,
	ReadOneDecorator,
	FxService,
	BaseController,
} from '@juicyllama/core'
import { InvoicesService } from './invoices.service'
import { BILLING_INVOICES_T as T } from './invoices.constants'
import { billingRoles as roles } from '../billing.constants'
import { billingInvoiceConstants as constants } from './invoices.constants'

@ApiTags('Invoices')
@UserAuth()
@Controller('billing/invoices')
export class InvoicesController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => InvoicesService)) readonly service: InvoicesService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
		@Inject(forwardRef(() => FxService)) readonly fxService: FxService,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
				fxService,
			},
			roles: roles,
		})
	}

	@ReadManyDecorator(constants)
	async findAll(@Req() req, @Query() query: any, @AccountId() account_id: number): Promise<T[]> {
		return super.findAll(req, query, account_id)
	}

	@ReadStatsDecorator(constants)
	async stats(
		@Req() req,
		@Query() query: any,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<any> {
		return super.stats(req, query, account_id, method)
	}

	@ReadChartsDecorator(constants)
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
		return super.charts(req, account_id, query, search, from, to, fields, period)
	}

	@ReadOneDecorator(constants)
	async findOne(@Req() req, @AccountId() account_id: number, @Param() params: any, @Query() query: any): Promise<T> {
		return super.findOne(req, account_id, params, query)
	}

	@ApiOperation({ summary: `Download invoice file` })
	@Post(`/download/:invoice_id`)
	async downloadInvoice(@Req() req, @AccountId() invoice_id: number, @AccountId() account_id: number): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)
		return await this.service.downloadInvoice(req.user, invoice_id)
	}
}
