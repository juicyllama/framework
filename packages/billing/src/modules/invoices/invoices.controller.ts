import {
	BadRequestException,
	Controller,
	forwardRef,
	Get,
	Post,
	Inject,
	NotFoundException,
	Param,
	Query,
	Req,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { IsNull } from 'typeorm'
import { ChartsPeriod, ChartsResponseDto, StatsMethods, StatsResponseDto, SupportedCurrencies } from '@juicyllama/utils'
import { AccountId, AuthService, ReadManyDecorator, UserAuth } from '@juicyllama/core'
import { Query as JLQuery } from '@juicyllama/core/dist/utils/typeorm/Query'
import {ReadChartsDecorator } from '@juicyllama/core/dist/decorators/crud.decorator'
import {crudCharts} from '@juicyllama/core/dist/helpers/crudController'
import {StorageService} from "@juicyllama/core/dist/modules/storage/storage.service";
import { Invoice } from './invoices.entity'
import { InvoicesService } from './invoices.service'
import { InvoiceOrderBy, InvoiceRelations, InvoiceSelect } from './invoices.enums'
import {T, E, SEARCH_FIELDS} from "./invoices.constants";

@ApiTags('Invoices')
@UserAuth()
@Controller('billing/invoices')
export class InvoicesController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => InvoicesService)) private readonly invoicesService: InvoicesService,
		@Inject(forwardRef(() => StorageService)) readonly storageService: StorageService,
		@Inject(forwardRef(() => JLQuery)) private readonly query: JLQuery<T>,
	) {}

	@ReadManyDecorator(E, InvoiceSelect, InvoiceOrderBy, InvoiceRelations)
	@ApiQuery({
		name: 'currency',
		description: 'The currency you are requesting data for',
		type: String,
		required: false,
		example: SupportedCurrencies.USD,
	})
	async findAll(@Req() req, @Query() query, @AccountId() account_id: number): Promise<T[]> {
		await this.authService.check(req.user.user_id, account_id)

		const where = {
			account: {
				account_id: account_id,
			},
			deleted_at: IsNull(),
			currency: query.currency ?? null,
		}

		const records = await this.invoicesService.findAll(this.query.findOptions(query, where))

		if (!records.length) {
			throw new NotFoundException(`No accounts found`)
		}

		return records
	}

	@ApiOperation({
		summary: 'Invoice Stats',
	})
	@ApiQuery({
		name: 'method',
		description: `The method you would like to run, defaults to \`${StatsMethods.COUNT}\``,
		type: String,
		required: false,
		example: StatsMethods.COUNT,
		enum: [StatsMethods.COUNT],
	})
	@ApiQuery({
		name: 'currency',
		description: 'The currency you are requesting data for',
		type: String,
		required: false,
		example: SupportedCurrencies.USD,
	})
	@ApiOkResponse({
		description: 'OK',
		type: StatsResponseDto,
	})
	@Get('stats')
	async stats(
		@Req() req,
		@Query() query,
		@Query('method') method: StatsMethods,
		@AccountId() account_id: number,
	): Promise<StatsResponseDto> {
		if (!method) {
			method = StatsMethods.COUNT
		}

		if (method === StatsMethods.AVG || method === StatsMethods.SUM) {
			throw new BadRequestException(`Only option for this endpoint currently is COUNT`)
		}

		await this.authService.check(req.user.user_id, account_id)

		const where = {
			account: {
				account_id: account_id,
			},
			deleted_at: IsNull(),
			currency: query.currency ?? null,
		}

		const options = {
			where: where,
		}

		switch (method) {
			case StatsMethods.COUNT:
				return {
					count: await this.invoicesService.count(options),
				}
		}
	}

	@ApiOperation({ summary: 'Get Invoice' })
	@ApiQuery({
		name: 'select',
		description: 'If you wish to specify which items you would like returning (boost performance)',
		type: [String],
		isArray: true,
		explode: false,
		required: false,
		example: `${InvoiceSelect.invoice_id},${InvoiceSelect.paid_at}`,
		enum: InvoiceSelect,
	})
	@ApiQuery({
		name: 'relations',
		description: 'Expand the result to include connected data',
		type: [String],
		isArray: true,
		explode: false,
		required: false,
		example: `${InvoiceRelations.account}`,
		enum: InvoiceRelations,
	})
	@ApiParam({
		name: 'invoice_id',
		description: 'The id of the invoice',
		type: Number,
		required: true,
		example: 1,
	})
	@ApiOkResponse({
		description: 'OK',
		type: Invoice,
	})
	@Get(':invoice_id')
	async findOne(
		@Req() req,
		@Param('invoice_id') invoice_id: number,
		@AccountId() account_id: number,
		@Query() query,
	): Promise<Invoice> {
		await this.authService.check(req.user.user_id, account_id)

		const where = {
			account: {
				account_id: account_id,
			},
			invoice_id: invoice_id,
			deleted_at: IsNull(),
		}

		const record = await this.invoicesService.findOne(this.query.findOneOptions(query, where))
		if (!record) {
			throw new NotFoundException(`Invoice #${invoice_id} not found`)
		}
		return record
	}

	@ApiOperation({summary: `Download invoice file`})
	@Post(`/download/:invoice_id`)
	async uploadAvatarFile(
		@Req() req,
		@AccountId() invoice_id: number,
		@AccountId() account_id: number,
	): Promise<T> {

		const user = req.user
		await this.authService.check(user.user_id, account_id)

		return await this.invoicesService.downloadInvoice(user, invoice_id)
	}

	@ReadChartsDecorator(E, InvoiceSelect)
	async charts(
		@Req() req,
		@Query() query: any,
		@Query('search') search: string,
		@Query('from') from: string,
		@Query('to') to: string,
		@Query('fields') fields: string[],
		@Query('period') period?: ChartsPeriod,
	): Promise<ChartsResponseDto> {
		return await crudCharts<T>({
			service: this.invoicesService,
			tQuery: this.query,
			query,
			search,
			period,
			fields,
			...(from && {from: new Date(from)}),
			...(to && {to: new Date(to)}),
			searchFields: SEARCH_FIELDS,
		})
	}
}
