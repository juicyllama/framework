import { Controller, forwardRef, Inject, Query, Param, UploadedFile } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { WebsitesService as Service } from './websites.service'
import {
	Query as TQuery,
	AuthService,
	UserAuth,
	BaseController,
	CreateDecorator,
	AccountId,
	ReadManyDecorator,
	ReadStatsDecorator,
	ReadChartsDecorator,
	ReadOneDecorator,
	UpdateDecorator,
	BulkUploadDecorator,
	BulkUploadDto,
	BulkUploadResponse,
	UploadFieldsDecorator,
	CrudUploadFieldsResponse,
	DeleteDecorator,
} from '@juicyllama/core'
import { CreateWebsiteDto as CreateDto, UpdateWebsiteDto as UpdateDto } from './websites.dto'
import { websiteConstants as constants, WEBSITES_T as T } from './websites.constants'
import { Req, Body } from '@nestjs/common'
import { ChartsPeriod, ChartsResponseDto, StatsMethods } from '@juicyllama/utils'

@ApiTags('Websites')
@UserAuth()
@Controller('websites/website')
export class WebsitesController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => Service)) readonly service: Service,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
		})
	}

	@CreateDecorator(constants)
	async create(@Req() req: AuthenticatedRequest, @Body() body: CreateDto, @AccountId() account_id: number): Promise<T> {
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
}
