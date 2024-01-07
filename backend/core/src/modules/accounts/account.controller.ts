import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	forwardRef,
	Inject,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UploadedFile,
} from '@nestjs/common'
import { StatsMethods, StatsResponseDto, Strings, SuccessResponseDto } from '@juicyllama/utils'
import { AuthService } from '../auth/auth.service.js'
import { AccountService } from './account.service.js'
import { AccountId } from '../../decorators/AccountId.decorator.js'
import {
	CreateDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UpdateDecorator,
	UploadImageDecorator,
} from '../../decorators/crud.decorator.js'
import { OnboardAccountDto, OnboardAdditionalAccountDto, SuccessAccountDto, UpdateAccountDto } from './account.dto.js'
import { Account } from './account.entity.js'
import { AccountOrderBy, AccountRelations, AccountSelect } from './account.enums.js'
import { TypeOrm } from '../../utils/typeorm/TypeOrm.js'
import { Query as TQuery } from '../../utils/typeorm/Query.js'
import { UserAuth } from '../../decorators/UserAuth.decorator.js'
import { UserRole } from '../users/users.enums.js'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { UsersService } from '../users/users.service.js'

const E = Account
type T = Account
const NAME = 'account'
const SEARCH_FIELDS = ['account_name', 'company_name']
const DEFAULT_ORDER_BY = 'account_name'
const PRIMARY_KEY = 'account_id'

@ApiTags(Strings.capitalize(NAME))
@Controller(`/${NAME}`)
export class AccountController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AccountService)) private readonly service: AccountService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<T>,
		@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
	) {}

	@CreateDecorator({ entity: SuccessAccountDto, name: NAME })
	async create(@Body() data: OnboardAccountDto): Promise<SuccessAccountDto> {
		return await this.service.onboard(data)
	}

	@UserAuth()
	@ApiOperation({ summary: 'Create Additional Account' })
	@Post('additional')
	async createAdditionalAccount(@Req() req, @Body() data: OnboardAdditionalAccountDto): Promise<SuccessAccountDto> {
		const user = await this.usersService.findById(req.user.user_id)
		return await this.service.onboardAdditional(user, data)
	}

	@UserAuth()
	@ReadManyDecorator({
		entity: E,
		selectEnum: AccountSelect,
		orderByEnum: AccountOrderBy,
		relationsEnum: AccountRelations,
		name: NAME,
	})
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
	@ReadStatsDecorator({ name: NAME })
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
	@ReadOneDecorator({
		entity: E,
		primaryKey: PRIMARY_KEY,
		selectEnum: AccountSelect,
		relationsEnum: AccountRelations,
		name: NAME,
	})
	async findOne(@Req() req, @Param() params, @Query() query): Promise<T> {
		await this.authService.check(req.user.user_id, params[Number(PRIMARY_KEY)])

		const where = {
			[PRIMARY_KEY]: params[PRIMARY_KEY],
		}

		const options = TypeOrm.findOneOptions<T>(query, where)
		return await this.service.findOne(options)
	}

	@UserAuth()
	@UpdateDecorator({ entity: E, primaryKey: PRIMARY_KEY, name: NAME })
	async update(@Req() req, @Body() data: UpdateAccountDto, @AccountId() account_id: number): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await this.service.update({
			account_id: account_id,
			...data,
		})
	}

	@UserAuth()
	@ApiOperation({ summary: 'Upload Account Avatar' })
	@UploadImageDecorator({ entity: E })
	@Patch(`avatar`)
	async uploadAvatarFile(
		@Req() req,
		@UploadedFile() file: Express.Multer.File,
		@AccountId() account_id: number,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		if (!file) {
			throw new BadRequestException(`Missing required field: file`)
		}
		if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|gif)/))) {
			throw new BadRequestException(`Not a valid jpg|jpeg|png|gif file`)
		}
		const account = await this.service.findById(account_id)
		return await this.service.uploadAvatar(account, file)
	}

	@UserAuth()
	@ApiOperation({ summary: 'Transfer Account Ownership' })
	@ApiParam({ name: 'user_id', description: 'User ID to transfer ownership to' })
	@Post(`transfer/:user_id`)
	//transfer
	async transfer(
		@Req() req,
		@AccountId() account_id: number,
		@Param(':user_id') user_id: number,
	): Promise<SuccessResponseDto> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER])

		const account = await this.service.findById(account_id)
		const user = await this.usersService.findById(user_id)
		return {
			success: await this.service.transfer(account, req.user, user),
		}
	}

	@UserAuth()
	@ApiOperation({ summary: 'Close Account' })
	@Delete()
	async close(@Req() req, @AccountId() account_id: number): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const account = await this.service.findById(account_id)
		return await this.service.remove(account)
	}
}
