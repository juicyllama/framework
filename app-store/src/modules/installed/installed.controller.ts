import { BadRequestException, Body, Controller, forwardRef, Inject, Param, Query, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { InstalledAppsService } from './installed.service'
import { AppsService } from '../apps.service'
import { CreateInstalledAppDto, UpdateInstalledAppDto } from './installed.dto'
import { AppIntegrationType } from '../apps.enums'
import { InstalledAppsOrderBy, InstalledAppsRelations, InstalledAppsSelect } from './installed.enums'
import {
	AccountId,
	AccountService,
	AuthService,
	CreateDecorator,
	crudPurge,
	crudFindAll,
	crudFindOne,
	crudStats,
	crudUpdate,
	DeleteDecorator,
	Query as TQuery,
	ReadManyDecorator,
	ReadOneDecorator,
	ReadStatsDecorator,
	UpdateDecorator,
	UserAuth,
	UsersService,
} from '@juicyllama/core'
import {
	INSTALLED_APP_DEFAULT_ORDER_BY,
	INSTALLED_APP_E,
	INSTALLED_APP_NAME,
	INSTALLED_APP_PRIMARY_KEY,
	INSTALLED_APP_SEARCH_FIELDS,
	INSTALLED_APP_T,
} from './installed.constants'

@ApiTags('Installed Apps')
@UserAuth()
@Controller('/apps/installed')
export class InstalledAppsController {
	constructor(
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<INSTALLED_APP_T>,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly service: InstalledAppsService,
		@Inject(forwardRef(() => AppsService)) private readonly appsService: AppsService,
		@Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
	) {}

	@CreateDecorator(INSTALLED_APP_E, INSTALLED_APP_NAME)
	async create(
		@Req() req,
		@AccountId() account_id: number,
		@Body() data: CreateInstalledAppDto,
	): Promise<INSTALLED_APP_T> {
		const app = await this.appsService.findById(data.app_id)

		if (!app) {
			throw new BadRequestException(`No app found with that app_id`)
		}

		await this.service.preInstallChecks(app, data.settings)

		const installed_app = await this.service.create({
			...data,
			app_id: app.app_id,
			account_id: account_id,
			user_id: req.user.user_id,
		})

		if (app.integration_type === AppIntegrationType.OAUTH2) {
			return await this.service.createOauthLink(installed_app)
		}

		return await this.service.removePrivateSettings(installed_app)
	}

	@ReadManyDecorator(
		INSTALLED_APP_E,
		InstalledAppsSelect,
		InstalledAppsOrderBy,
		InstalledAppsRelations,
		INSTALLED_APP_NAME,
	)
	async findAll(@Req() req, @AccountId() account_id: number, @Query() query): Promise<INSTALLED_APP_T[]> {
		const records = await crudFindAll<INSTALLED_APP_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			searchFields: INSTALLED_APP_SEARCH_FIELDS,
			order_by: INSTALLED_APP_DEFAULT_ORDER_BY,
		})

		for (const r in records) {
			records[r] = await this.service.removePrivateSettings(records[r])
		}

		return records
	}

	@ReadStatsDecorator(INSTALLED_APP_NAME)
	async stats(
		@Req() req,
		@AccountId() account_id: number,
		@Query() query,
		@Query('method') method?: StatsMethods,
	): Promise<StatsResponseDto> {
		return await crudStats<INSTALLED_APP_T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: account_id,
			query: query,
			method: method,
			searchFields: INSTALLED_APP_SEARCH_FIELDS,
		})
	}

	@ReadOneDecorator(
		INSTALLED_APP_E,
		INSTALLED_APP_PRIMARY_KEY,
		InstalledAppsSelect,
		InstalledAppsRelations,
		INSTALLED_APP_NAME,
	)
	async findOne(@Req() req, @Param() params, @Query() query): Promise<INSTALLED_APP_T> {
		const record = await crudFindOne<INSTALLED_APP_T>({
			service: this.service,
			query: query,
			primaryKey: params[INSTALLED_APP_PRIMARY_KEY],
		})
		return await this.service.removePrivateSettings(record)
	}

	@UpdateDecorator(INSTALLED_APP_E, INSTALLED_APP_PRIMARY_KEY, INSTALLED_APP_NAME)
	async update(@Req() req, @Body() data: UpdateInstalledAppDto, @Param() params): Promise<INSTALLED_APP_T> {
		if (data.settings) {
			const installed_app = await this.service.findById(params[INSTALLED_APP_PRIMARY_KEY])
			await this.service.preInstallChecks(installed_app.app, data.settings)
		}

		const record = await crudUpdate<INSTALLED_APP_T>({
			service: this.service,
			data: data,
			primaryKey: params[INSTALLED_APP_PRIMARY_KEY],
		})
		return await this.service.removePrivateSettings(record)
	}

	@DeleteDecorator(INSTALLED_APP_E, INSTALLED_APP_PRIMARY_KEY, INSTALLED_APP_NAME)
	async remove(@Req() req, @Param() params): Promise<INSTALLED_APP_T> {
		return await crudPurge<INSTALLED_APP_T>({
			service: this.service,
			primaryKey: params[INSTALLED_APP_PRIMARY_KEY],
		})
	}
}
