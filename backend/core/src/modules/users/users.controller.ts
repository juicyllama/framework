import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Patch,
	Query,
	Req,
	UploadedFile,
	forwardRef,
	Inject,
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
	BulkUploadDecorator,
	UserAuth,
} from '../../decorators'
import { Query as TQuery } from '../../utils/typeorm/Query'
import {
	UPLOAD_FIELDS,
	DEFAULT_ORDER_BY,
	E,
	NAME,
	PRIMARY_KEY,
	SEARCH_FIELDS,
	T,
	UPLOAD_DUPLICATE_FIELD,
} from './users.constants'
import { crudDelete, crudFindAll, crudStats } from '../../helpers'
import { ReadChartsDecorator, UploadFieldsDecorator, UploadImageDecorator } from '../../decorators/crud.decorator'
import { crudCharts, crudBulkUpload } from '../../helpers/crudController'
import { StorageService } from '../storage/storage.service'
import { CrudUploadFieldsResponse, BulkUploadDto, BulkUploadResponse } from '../../types/common'

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
	) {}

	@CreateDecorator({ entity: E, name: NAME })
	async create(@Req() req, @AccountId() account_id: number, @Body() data: CreateUserDto): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const account = await this.accountService.findById(account_id)
		return await this.service.invite(account, data)
	}

	@ReadManyDecorator({
		entity: E,
		selectEnum: UserSelect,
		orderByEnum: UserOrderBy,
		relationsEnum: UserRelations,
		name: NAME,
	})
	async findAll(@AccountId() account_id: number, @Query() query): Promise<T[]> {
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

	@ReadStatsDecorator({ name: NAME })
	async stats(
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

	@ReadChartsDecorator({ entity: E, selectEnum: UserSelect, name: NAME })
	async charts(
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

	@ReadOneDecorator({
		entity: E,
		selectEnum: UserSelect,
		primaryKey: PRIMARY_KEY,
		relationsEnum: UserRelations,
		name: NAME,
	})
	async findOne(@AccountId() account_id: number, @Param() params): Promise<T> {
		const user = await this.service.findOne({
			where: {
				user_id: params[PRIMARY_KEY],
				accounts: {
					account_id: account_id,
				},
			},
		})

		if (!user) {
			throw new BadRequestException(`User #${params[PRIMARY_KEY]} not found`)
		}

		delete user.password
		return user
	}

	@UpdateDecorator({ entity: E, primaryKey: PRIMARY_KEY, name: NAME })
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
	@UploadImageDecorator({ entity: E })
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

	@BulkUploadDecorator({ supportedFields: UPLOAD_FIELDS, dedupField: UPLOAD_DUPLICATE_FIELD })
	async bulkUpload(
		@Req() req,
		@Body() params: BulkUploadDto,
		@AccountId() account_id: number,
		@UploadedFile() file?: Express.Multer.File,
	): Promise<BulkUploadResponse> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudBulkUpload<T>({
			fields: UPLOAD_FIELDS,
			dedup_field: UPLOAD_DUPLICATE_FIELD,
			service: this.service,
			...params,
			file: file,
		})
	}

	@UploadFieldsDecorator()
	async uploadFileFields(): Promise<CrudUploadFieldsResponse> {
		return {
			fields: UPLOAD_FIELDS,
			dedup_field: UPLOAD_DUPLICATE_FIELD,
		}
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

	@DeleteDecorator({ entity: E, primaryKey: PRIMARY_KEY, name: NAME })
	async remove(@Req() req, @AccountId() account_id: number, @Param() params): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudDelete<T>({
			service: this.service,
			primaryKey: params[PRIMARY_KEY],
		})
	}
}
