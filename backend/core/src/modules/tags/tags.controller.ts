import { StatsMethods, StatsResponseDto, Strings } from '@juicyllama/utils'
import { ApiTags } from '@nestjs/swagger'
import { BadRequestException, Body, Controller, forwardRef, Inject, Param, Query, Req } from '@nestjs/common'
import { Tag } from './tags.entity.js'
import { TagsService } from './tags.service.js'
import { Query as TQuery } from '../../utils/typeorm/Query.js'
import {
	CreateDecorator,
	DeleteDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UpdateDecorator,
} from '../../decorators/crud.decorator.js'
import { CreateTagDto, UpdateTagDto } from './tags.dtos.js'
import { UserAuth } from '../../decorators/UserAuth.decorator.js'
import { TypeOrm } from '../../utils/typeorm/TypeOrm.js'
import { TagsOrderBy, TagsRelations, TagsSelect } from './tags.enum.js'
import { AccountId } from '../../decorators/AccountId.decorator.js'

const E = Tag
type T = Tag
const NAME = 'tag'
const SEARCH_FIELDS = ['name']
const DEFAULT_ORDER_BY = 'name'
const PRIMARY_KEY = 'tag_id'

@ApiTags('Tags')
@Controller(`/${Strings.plural(NAME)}`)
export class TagsController {
	constructor(
		@Inject(forwardRef(() => TagsService)) private readonly service: TagsService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<T>,
	) {}

	@UserAuth()
	@CreateDecorator(E, NAME)
	async create(@Body() data: CreateTagDto): Promise<T> {
		return this.service.create(data.name)
	}

	@UserAuth()
	@ReadManyDecorator(E, TagsSelect, TagsOrderBy, TagsRelations, NAME)
	async findAll(@Req() req, @Query() query): Promise<T[]> {
		const where = this.tQuery.buildWhere({
			repository: this.service.repository,
			query: query,
			account_ids: req.user.account_ids,
			search_fields: SEARCH_FIELDS,
		})

		const options = TypeOrm.findOptions<T>(query, where, DEFAULT_ORDER_BY)
		return await this.service.findAll(options)
	}

	@UserAuth()
	@ReadStatsDecorator(NAME)
	async stats(@Req() req, @Query() query, @Query('method') method?: StatsMethods): Promise<StatsResponseDto> {
		if (!method) {
			method = StatsMethods.COUNT
		}
		if (method === StatsMethods.AVG || method === StatsMethods.SUM) {
			throw new BadRequestException(`Only option for this endpoint currently is COUNT`)
		}

		const where = this.tQuery.buildWhere({
			repository: this.service.repository,
			query: query,
			account_ids: req.user.account_ids,
			search_fields: SEARCH_FIELDS,
		})

		const options = {
			where: where,
		}

		switch (method) {
			case StatsMethods.COUNT:
				return {
					count: await this.service.count(options),
				}
		}
	}

	@UserAuth()
	@ReadOneDecorator(E, PRIMARY_KEY, TagsSelect, TagsRelations, NAME)
	async findOne(@Param() params, @Query() query): Promise<T> {
		const where = {
			[PRIMARY_KEY]: params[PRIMARY_KEY],
		}

		const options = TypeOrm.findOneOptions<T>(query, where)
		return await this.service.findOne(options)
	}

	@UserAuth()
	@UpdateDecorator(E, PRIMARY_KEY, NAME)
	async update(@Body() data: UpdateTagDto, @Param() params): Promise<T> {
		return await this.service.update({
			[PRIMARY_KEY]: params[PRIMARY_KEY],
			name: data.name,
		})
	}

	@UserAuth()
	@DeleteDecorator(E, PRIMARY_KEY, NAME)
	async remove(@Param() params): Promise<void> {
		const record = await this.service.findById(params[PRIMARY_KEY])
		return await this.service.purge(record)
	}
}
