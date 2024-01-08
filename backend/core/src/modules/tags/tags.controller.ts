import { ChartsPeriod, ChartsResponseDto, StatsMethods } from '@juicyllama/utils'
import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, forwardRef, Inject, Param, Query, Req, UploadedFile } from '@nestjs/common'
import { TagsService } from './tags.service.js'
import { Query as TQuery } from '../../utils/typeorm/Query.js'
import { UserAuth } from '../../decorators/UserAuth.decorator.js'
import { BaseController } from '../../helpers/baseController.js'
import { TAGS_T as T, tagsConstants as constants } from './tags.constants.js'
import { AuthService } from '../auth/auth.service.js'
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
} from '../../decorators/crud.decorator.js'
import { AccountId } from '../../decorators/AccountId.decorator.js'
import { CreateTagDto as CreateDto, UpdateTagDto as UpdateDto } from './tags.dtos.js'
import { BulkUploadDto, BulkUploadResponse, CrudUploadFieldsResponse } from '../../types/common.js'

@ApiTags('Tags')
@UserAuth()
@Controller(`/tags`)
export class TagsController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => TagsService)) readonly service: TagsService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
			delete: 'PURGE',
		})
	}

	@CreateDecorator(constants)
	async create(@Req() req, @Body() body: CreateDto, @AccountId() account_id: number): Promise<T> {
		return super.create(req, body, account_id)
	}

	@ReadManyDecorator(constants)
	async findAll(@Req() req, @Query() query, @AccountId() account_id: number): Promise<T[]> {
		return super.findAll(req, query, account_id)
	}

	@ReadStatsDecorator(constants)
	async stats(
		@Req() req,
		@Query() query,
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
	async findOne(@Req() req, @AccountId() account_id: number, @Param() params, @Query() query): Promise<T> {
		return super.findOne(req, account_id, params, query)
	}

	@UpdateDecorator(constants)
	async update(@Req() req, @AccountId() account_id: number, @Body() data: UpdateDto, @Param() params): Promise<T> {
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
	async remove(@Req() req, @Param() params, @AccountId() account_id: number): Promise<T> {
		return super.remove(req, params, account_id)
	}
}
