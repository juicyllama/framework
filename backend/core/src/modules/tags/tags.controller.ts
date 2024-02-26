import { ChartsPeriod, ChartsResponseDto, StatsMethods } from '@juicyllama/utils'
import { Body, Controller, Inject, Param, Query, Req, UploadedFile } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Query as TQuery } from '../../utils/typeorm/Query'
import { AccountId } from '../../decorators/AccountId.decorator'
import {
	BulkUploadDecorator,
	CreateDecorator,
	DeleteDecorator,
	ReadChartsDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UpdateDecorator,
	UploadFieldsDecorator,
} from '../../decorators/crud.decorator'
import { UserAuth } from '../../decorators/UserAuth.decorator'
import { BaseController } from '../../helpers/baseController'
import { AuthenticatedRequest } from '../../types/authenticated-request.interface'
import { BulkUploadDto, BulkUploadResponse, CrudUploadFieldsResponse } from '../../types/common'
import { AuthService } from '../auth/auth.service'
import { TAGS_T as T, tagsConstants as constants } from './tags.constants'
import { CreateTagDto as CreateDto, UpdateTagDto as UpdateDto } from './tags.dtos'
import { TagsService } from './tags.service'

@ApiTags('Tags')
@UserAuth()
@Controller(`/tags`)
export class TagsController extends BaseController<T> {
	constructor(
		readonly authService: AuthService,
		readonly service: TagsService,
		@Inject(TQuery) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
			delete: 'PURGE',
		})
	}

	@CreateDecorator(constants)
	async create(
		@Req() req: AuthenticatedRequest,
		@Body() body: CreateDto,
		@AccountId() account_id: number,
	): Promise<T> {
		return super.create(req, body, account_id)
	}

	@ReadManyDecorator(constants)
	async findAll(
		@Req() req: AuthenticatedRequest,
		@Query() query: any,
		@AccountId() account_id: number,
	): Promise<T[]> {
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
	async findOne(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param() params: any,
		@Query() query: any,
	): Promise<T> {
		return super.findOne(req, account_id, params, query)
	}

	@UpdateDecorator(constants)
	async update(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Body() data: UpdateDto,
		@Param() params: any,
	): Promise<T> {
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
