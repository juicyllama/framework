import {
	BadRequestException,
	Body,
	Controller,
	forwardRef,
	Inject,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UploadedFile,
} from '@nestjs/common'
import { ChartsPeriod, ChartsResponseDto, StatsMethods, StatsResponseDto, Strings } from '@juicyllama/utils'
import { CreateUserDto, UpdateUserDto } from './users.dto'
import { UserOrderBy, UserRelations, UserRole, UserSelect } from './users.enums'
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { AccountService } from '../accounts/account.service'
import { UsersService } from './users.service'
import {
	AccountId,
	CreateDecorator,
	DeleteDecorator,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UpdateDecorator,
	UploadFileDecorator,
	UserAuth,
} from '../../decorators'
import { Query as TQuery } from '../../utils/typeorm/Query'
import { CSV_FIELDS, DEFAULT_ORDER_BY, E, NAME, PRIMARY_KEY, SEARCH_FIELDS, T } from './users.constants'
import { crudDelete, crudFindAll, crudFindOne, crudStats } from '../../helpers'
import { ReadChartsDecorator, UploadCSVDecorator } from '../../decorators/crud.decorator'
import { crudCharts, crudUploadCSV } from '../../helpers/crudController'
import { CsvService } from '../csv/csv.service'
import { StorageService } from '../storage/storage.service'
import { CrudUploadCSVResponse } from '../../types/common'

@ApiTags(Strings.capitalize(Strings.plural(NAME)))
@UserAuth()
@Controller(`/${Strings.plural(NAME)}`)
export class UsersController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<T>,
		@Inject(forwardRef(() => UsersService)) private readonly service: UsersService,
		@Inject(forwardRef(() => StorageService)) readonly storageService: StorageService,
		@Inject(forwardRef(() => CsvService)) private readonly csvService: CsvService,
	) {}

	@CreateDecorator(E, NAME)
	async create(@Req() req, @AccountId() account_id: number, @Body() data: CreateUserDto): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const account = await this.accountService.findById(account_id)
		return await this.service.invite(account, data)
	}

	@ReadManyDecorator(E, UserSelect, UserOrderBy, UserRelations, NAME)
	async findAll(@Req() req, @AccountId() account_id: number, @Query() query): Promise<T[]> {
		const users = await crudFindAll<T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: SEARCH_FIELDS,
			order_by: DEFAULT_ORDER_BY,
		})

		for (const u in users) {
			delete users[u].password
		}
		return users
	}

	@ReadStatsDecorator(NAME)
	async stats(
		@Req() req,
		@AccountId() account_id: number,
		@Query() query,
		@Query('method') method?: StatsMethods,
	): Promise<StatsResponseDto> {
		return await crudStats<T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: SEARCH_FIELDS,
		})
	}

	@ReadChartsDecorator(E, UserSelect, NAME)
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
			service: this.service,
			tQuery: this.tQuery,
			query,
			search,
			period,
			fields,
			...(from && { from: new Date(from) }),
			...(to && { to: new Date(to) }),
			searchFields: SEARCH_FIELDS,
		})
	}

	@ReadOneDecorator(E, PRIMARY_KEY, UserSelect, UserRelations, NAME)
	async findOne(@Req() req, @AccountId() account_id: number, @Param() params, @Query() query): Promise<T> {
		const user = await crudFindOne<T>({
			service: this.service,
			query: query,
			primaryKey: params[PRIMARY_KEY],
		})

		delete user.password
		return user
	}

	@UpdateDecorator(E, PRIMARY_KEY, NAME)
	async update(
		@Req() req,
		@AccountId() account_id: number,
		@Body() data: UpdateUserDto,
		@Param() params,
	): Promise<T> {
		let user = req.user
		if (params[PRIMARY_KEY] !== req.user.user_id) {
			await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
			user = await this.service.findById(params[PRIMARY_KEY])
			if (!user) {
				throw new BadRequestException(`User #${params[PRIMARY_KEY]} not found`)
			}
		}

		delete user.password
		return await this.service.update({
			...user,
			...data,
		})
	}

	@ApiOperation({ summary: `Upload ${Strings.capitalize(NAME)} Avatar` })
	@UploadFileDecorator(E)
	@Patch(`:user_id/avatar`)
	async uploadAvatarFile(
		@Req() req,
		@UploadedFile() file: Express.Multer.File,
		@AccountId() account_id: number,
		@Param() params,
	): Promise<T> {
		if (!file) {
			throw new BadRequestException(`Missing required field: file`)
		}
		if (!Boolean(file.mimetype.match(/(jpg|jpeg|png|gif)/))) {
			throw new BadRequestException(`Not a valid jpg|jpeg|png|gif file`)
		}

		let user = req.user
		if (params[PRIMARY_KEY] !== req.user.user_id) {
			await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
			user = await this.service.findById(params[PRIMARY_KEY])
			if (!user) {
				throw new BadRequestException(`User #${params[PRIMARY_KEY]} not found`)
			}
		} else {
			user = await this.service.findById(req.user.user_id)
		}

		return await this.service.uploadAvatar(user, file)
	}

	@ApiOperation({ summary: `Upload ${Strings.capitalize(NAME)}s CSV File` })
	@UploadCSVDecorator()
	@Post(`upload_csv`)
	async uploadCSVFile(
		@Req() req,
		@UploadedFile() file: Express.Multer.File,
		@AccountId() account_id: number,
	): Promise<CrudUploadCSVResponse> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudUploadCSV<T>(file, CSV_FIELDS, {
			service: this.service,
			csvService: this.csvService,
		})
	}

	@ApiOperation({ summary: `Update ${Strings.capitalize(NAME)} Role` })
	@ApiParam({ name: PRIMARY_KEY })
	@ApiQuery({
		name: 'role',
		type: 'string',
		enum: UserRole,
		description: 'Role to assign to user',
		required: true,
	})
	@ApiOkResponse({
		description: `OK`,
		type: E,
	})
	@Patch(`:user_id/role`)
	async update_role(
		@Req() req,
		@AccountId() account_id: number,
		@Param() params,
		@Body('role') role: UserRole,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const account = await this.accountService.findById(account_id)
		const user = await this.service.findById(params[PRIMARY_KEY])
		return await this.authService.assignRole(user, account, role)
	}

	@DeleteDecorator(E, PRIMARY_KEY, NAME)
	async remove(@Req() req, @AccountId() account_id: number, @Param() params): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudDelete<T>({
			service: this.service,
			primaryKey: params[PRIMARY_KEY],
		})
	}
}
