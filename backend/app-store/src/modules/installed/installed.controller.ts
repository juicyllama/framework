import { BadRequestException, Body, Controller, forwardRef, Inject, Param, Query, Req, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StatsMethods, StatsResponseDto } from '@juicyllama/utils'
import { InstalledAppsService } from './installed.service'
import { AppsService } from '../apps.service'
import { CreateInstalledAppDto, InstalledAppPreCheckDto, UpdateInstalledAppDto, preInstallCheckResponse } from './installed.dto'
import { AppIntegrationType } from '../apps.enums'
import { InstalledAppsOrderBy, InstalledAppsRelations, InstalledAppsSelect } from './installed.enums'
import {
	AccountId,
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
		@Inject(forwardRef(() => TQuery)) private readonly tQuery: TQuery<INSTALLED_APP_T>,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly service: InstalledAppsService,
		@Inject(forwardRef(() => AppsService)) private readonly appsService: AppsService,
	) {}


	//todo add swagger
	@Post('precheck')
	async preInstallCheck(
		@AccountId() account_id: number,
		@Body() data: InstalledAppPreCheckDto,
	): Promise<preInstallCheckResponse> {

		const app = await this.appsService.findById(data.app_id)

		if (!app) {
			throw new BadRequestException(`No app found with that app_id`)
		}

		return await this.service.preInstallChecks(app, data.settings, account_id)
	}

	@CreateDecorator({ entity: INSTALLED_APP_E, name: INSTALLED_APP_NAME })
	async create(
		@Req() req,
		@AccountId() account_id: number,
		@Body() data: CreateInstalledAppDto,
	): Promise<INSTALLED_APP_T> {
		const app = await this.appsService.findById(data.app_id)

		if (!app) {
			throw new BadRequestException(`No app found with that app_id`)
		}

		if ((await this.service.checkRequiredSettings(data)) === false) {
			throw new BadRequestException(`Missing required settings`)
		}

		const checks = await this.service.preInstallChecks(app, data.settings, account_id)

		if (checks.result === false) {
			throw new BadRequestException(checks.error)
		}

		const installed_app = await this.service.create({
			...data,
			app_id: app.app_id,
			account_id: account_id,
			user_id: req.user.user_id,
		})

		installed_app.app = app

		if (app.integration_type === AppIntegrationType.OAUTH2) {
			installed_app.oauth_redirect_url = this.service.createOauthLink(installed_app)

			await this.service.update({
				installed_app_id: installed_app.installed_app_id,
				oauth_redirect_url: installed_app.oauth_redirect_url,
			})
		}

		return await this.service.removePrivateSettings(installed_app)
	}

	@ReadManyDecorator({
		entity: INSTALLED_APP_E,
		selectEnum: InstalledAppsSelect,
		orderByEnum: InstalledAppsOrderBy,
		relationsEnum: InstalledAppsRelations,
		name: INSTALLED_APP_NAME,
	})
	async findAll(@AccountId() account_id: number, @Query() query): Promise<INSTALLED_APP_T[]> {
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

	

	@ReadStatsDecorator({ name: INSTALLED_APP_NAME })
	async stats(
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

	@ReadOneDecorator({
		entity: INSTALLED_APP_E,
		primaryKey: INSTALLED_APP_PRIMARY_KEY,
		selectEnum: InstalledAppsSelect,
		relationsEnum: InstalledAppsRelations,
		name: INSTALLED_APP_NAME,
	})
	async findOne(@Param() params, @Query() query): Promise<INSTALLED_APP_T> {
		const record = await crudFindOne<INSTALLED_APP_T>({
			service: this.service,
			query: query,
			primaryKey: params[INSTALLED_APP_PRIMARY_KEY],
		})
		return await this.service.removePrivateSettings(record)
	}

	@UpdateDecorator({
		entity: INSTALLED_APP_E,
		primaryKey: INSTALLED_APP_PRIMARY_KEY,
		name: INSTALLED_APP_NAME,
	})
	async update(@Body() data: UpdateInstalledAppDto, @Param() params): Promise<INSTALLED_APP_T> {
		if (data.settings) {
			const installed_app = await this.service.findById(params[INSTALLED_APP_PRIMARY_KEY])
			const checks = await this.service.preInstallChecks(installed_app.app, data.settings, installed_app.account_id)

			if (checks.result === false) {
				throw new BadRequestException(checks.error)
			}
		}

		const record = await crudUpdate<INSTALLED_APP_T>({
			service: this.service,
			data: data,
			primaryKey: params[INSTALLED_APP_PRIMARY_KEY],
		})
		return await this.service.removePrivateSettings(record)
	}

	@DeleteDecorator({
		entity: INSTALLED_APP_E,
		primaryKey: INSTALLED_APP_PRIMARY_KEY,
		name: INSTALLED_APP_NAME,
	})
	async remove(@Param() params): Promise<INSTALLED_APP_T> {
		return await crudPurge<INSTALLED_APP_T>({
			service: this.service,
			primaryKey: params[INSTALLED_APP_PRIMARY_KEY],
		})
	}

	
}
