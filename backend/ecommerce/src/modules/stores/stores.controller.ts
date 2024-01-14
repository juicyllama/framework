import { Body, Controller, forwardRef, Inject, Param, Query, Req, UploadedFile } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ChartsPeriod, ChartsResponseDto, StatsMethods } from '@juicyllama/utils'
import { StoresService } from './stores.service'
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
	BaseController,
	ReadChartsDecorator,
	BulkUploadDecorator,
	BulkUploadDto,
	BulkUploadResponse,
	CrudUploadFieldsResponse,
	UploadFieldsDecorator,
} from '@juicyllama/core'
import { CreateStoreDto as CreateDto, UpdateStoreDto as UpdateDto } from './stores.dto'
import { STORE_T as T, storeConstants as constants } from './stores.constants'

@ApiTags('Stores')
@UserAuth()
@Controller('ecommerce/stores')
export class StoresController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => StoresService)) readonly service: StoresService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
		})
	}

	@CreateDecorator(constants)
	async create(@Req() req, @Body() body: CreateDto, @AccountId() account_id: number): Promise<T> {
		return super.create(req, body, account_id)
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
	async findOne(@Req() req, @AccountId() account_id: number, @Param() params: any, @Query() query: any): Promise<T> {
		return super.findOne(req, account_id, params, query)
	}

	@UpdateDecorator(constants)
	async update(@Req() req, @AccountId() account_id: number, @Body() data: UpdateDto, @Param() params: any): Promise<T> {
		return super.update(req, account_id, data, params)
	}

	@BulkUploadDecorator(constants)
	async bulkUpload(
		@Req() req,
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
	async remove(@Req() req, @Param() params: any, @AccountId() account_id: number): Promise<T> {
		return super.remove(req, params, account_id)
	}
}
