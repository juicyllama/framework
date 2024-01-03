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
import { StatsMethods, StatsResponseDto, Strings } from '@juicyllama/utils'
import { CreateUserDto, UpdateUserDto } from './users.dto'
import { UserRole } from './users.enums'
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
	usersConstants as constants,
} from './users.constants'
import { crudDelete } from '../../helpers'
import { UploadFieldsDecorator, UploadImageDecorator } from '../../decorators/crud.decorator'
import { crudBulkUpload } from '../../helpers/crudController'
import { StorageService } from '../storage/storage.service'
import { CrudUploadFieldsResponse, BulkUploadDto, BulkUploadResponse } from '../../types/common'
import { TypeOrm } from '../../utils/typeorm/TypeOrm'

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

	@CreateDecorator(constants)
	async create(@Req() req, @AccountId() account_id: number, @Body() data: CreateUserDto): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const account = await this.accountService.findById(account_id)
		return await this.service.invite(account, data)
	}

	@ReadManyDecorator(constants)
	async findAll(@AccountId() account_id: number, @Query() query): Promise<T[]> {
		const where = this.tQuery.buildWhere({
			repository: this.service.repository,
			query: query,
			account_id: account_id,
			search_fields: SEARCH_FIELDS,
		})

		const options = TypeOrm.findOptions<T>(query, where, DEFAULT_ORDER_BY)
		const users = await this.service.findAll(options)

		for (const u in users) {
			delete users[u].password
		}
		return users
	}

	@ReadStatsDecorator(constants)
	async stats(
		@AccountId() account_id: number,
		@Query() query,
		@Query('method') method?: StatsMethods,
	): Promise<StatsResponseDto> {
		if (!method) {
			method = StatsMethods.COUNT
		}
		if (method === StatsMethods.AVG || method === StatsMethods.SUM) {
			throw new BadRequestException(`Only option for this endpoint currently is COUNT`)
		}

		const where = this.tQuery.buildWhere({
			repository: this.service.repository,
			account_id: account_id,
			query: query,
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

	//todo fix to restrict to correct account_id
	// @ReadChartsDecorator({ entity: E, selectEnum: UserSelect, name: NAME })
	// async charts(
	// 	@Query() query: any,
	// 	@Query('search') search: string,
	// 	@Query('from') from: string,
	// 	@Query('to') to: string,
	// 	@Query('fields') fields: string[],
	// 	@Query('period') period?: ChartsPeriod,
	// ): Promise<ChartsResponseDto> {
	// 	return await crudCharts<T>({
	// 		service: this.service,
	// 		tQuery: this.tQuery,
	// 		query,
	// 		search,
	// 		period,
	// 		fields,
	// 		...(from && { from: new Date(from) }),
	// 		...(to && { to: new Date(to) }),
	// 		searchFields: SEARCH_FIELDS,
	// 	})
	// }

	@ReadOneDecorator(constants)
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

	@UpdateDecorator(constants)
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

	@BulkUploadDecorator(constants)
	async bulkUpload(
		@Req() req,
		@Body() body: BulkUploadDto,
		@AccountId() account_id: number,
		@UploadedFile() file?: Express.Multer.File,
	): Promise<BulkUploadResponse> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		const res = await crudBulkUpload<T>({
			fields: UPLOAD_FIELDS,
			dedup_field: UPLOAD_DUPLICATE_FIELD,
			service: this.service,
			...body,
			file: file,
		})
		const users = await this.service.findAll({
			where: {
				user_id: res.ids,
			},
		})
		const account = await this.accountService.findById(account_id)
		await Promise.all(
			users.map(async user => {
				await this.service.invite(account, user)
			}),
		)
		return res
	}

	@UploadFieldsDecorator(constants)
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

	@DeleteDecorator(constants)
	async remove(@Req() req, @AccountId() account_id: number, @Param() params): Promise<T> {
		await this.authService.check(req.user.user_id, account_id, [UserRole.OWNER, UserRole.ADMIN])
		return await crudDelete<T>({
			service: this.service,
			primaryKey: params[PRIMARY_KEY],
		})
	}
}
