import {
	BadRequestException,
	Body,
	Controller,
	forwardRef,
	Inject,
	Param,
	Query,
	Req,
	UploadedFile,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChartsPeriod, ChartsResponseDto, StatsMethods } from '@juicyllama/utils'
import { TransactionsService } from './transactions.service'
import {
	Query as TQuery,
	AccountId,
	AuthService,
	CreateDecorator,
	DeleteDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UpdateDecorator,
	UserAuth,
	ReadChartsDecorator,
	FxService,
	BaseController,
	BulkUploadDecorator,
	BulkUploadDto,
	CrudUploadFieldsResponse,
	UploadFieldsDecorator,
	BulkUploadResponse,
} from '@juicyllama/core'
import { StoresService } from '../stores/stores.service'
import { transactionConstants as constants, TRANSACTION_T as T } from './transactions.constants'
import { CreateTransactionDto as CreateDto, UpdateTransactionDto as UpdateDto } from './transactions.dto'

@ApiTags('Transactions')
@UserAuth()
@Controller('ecommerce/transactions')
export class TransactionsController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => TransactionsService)) readonly service: TransactionsService,
		@Inject(forwardRef(() => StoresService)) readonly storesService: StoresService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
		@Inject(forwardRef(() => FxService)) readonly fxService: FxService,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
		})
	}

	@CreateDecorator(constants)
	async create(@Req() req: AuthenticatedRequest, @Body() body: CreateDto, @AccountId() account_id: number): Promise<T> {
		await this.storeAuth(account_id, body.store_id)
		return super.create(req, body, account_id)
	}

	@ReadManyDecorator(constants)
	async findAll(@Req() req: AuthenticatedRequest, @Query() query: any, @AccountId() account_id: number): Promise<T[]> {
		return super.findAll(req, query, account_id)
	}

	@ReadStatsDecorator(constants)
	async stats(
		@Req() req: AuthenticatedRequest,
		@Query() query: any,
		@AccountId() account_id: number,
		@Query('method') method: StatsMethods,
	): Promise<any> {
		return super.stats(req, query, account_id, method)
	}

	@ReadChartsDecorator(constants)
	async charts(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Query() query: any: any,
		@Query('search') search: string,
		@Query('from') from: string,
		@Query('to') to: string,
		@Query('fields') fields: string[],
		@Query('period') period?: ChartsPeriod,
	): Promise<ChartsResponseDto> {
		return super.charts(req, account_id, query, search, from, to, fields, period)
	}

	@ReadOneDecorator(constants)
	async findOne(@Req() req: AuthenticatedRequest, @AccountId() account_id: number, @Param() params: any, @Query() query: any): Promise<T> {
		return super.findOne(req, account_id, params, query)
	}

	@UpdateDecorator(constants)
	async update(@Req() req: AuthenticatedRequest, @AccountId() account_id: number, @Body() data: UpdateDto, @Param() params: any): Promise<T> {
		return super.update(req, account_id, data, params)
	}

	@BulkUploadDecorator(constants)
	async bulkUpload(
		@Req() req: AuthenticatedRequest,
		@Body() body: BulkUploadDto,
		@AccountId() account_id: number,
		@UploadedFile() file?: Express.Multer.File,
	): Promise<BulkUploadResponse> {
		return super.bulkUpload(req, body, account_id, file)
	}

	@UploadFieldsDecorator(constants)
	async uploadFileFields(): Promise<CrudUploadFieldsResponse> {
		return super.uploadFileFields()
	}

	@DeleteDecorator(constants)
	async remove(@Req() req: AuthenticatedRequest, @Param() params: any, @AccountId() account_id: number): Promise<T> {
		return super.remove(req, params, account_id)
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
