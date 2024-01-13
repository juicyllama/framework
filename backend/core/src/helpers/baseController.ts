import { ApiForbiddenResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Query as TQuery } from '../utils/typeorm/Query'
import { ObjectLiteral } from 'typeorm'
import {
	crudBulkUpload,
	crudCharts,
	crudCreate,
	crudDelete,
	crudFindAll,
	crudFindOne,
	crudPurge,
	crudStats,
	crudUpdate,
} from './crudController'
import {
	BulkUploadDto,
	BulkUploadResponse,
	ControllerConstants,
	ControllerOptionalProps,
	CrudUploadFieldsResponse,
} from '../types/common'
import { ChartsPeriod, ChartsResponseDto, StatsMethods, StatsResponseDto } from '@juicyllama/utils'

/**
 * Base controller for endpoints
 *
 * * Exposes all (or selected) CRUD operations
 *
 */

@ApiUnauthorizedResponse({
	description: 'Authentication problem, check access token or account permissions',
})
@ApiForbiddenResponse({
	description: 'User role does not have sufficient permissions to access this endpoint',
})
@ApiNotFoundResponse({ description: 'Not Found' })
export class BaseController<T extends ObjectLiteral> {
	constructor(
		readonly service: any,
		readonly tQuery: TQuery<T>,
		readonly constants: ControllerConstants,
		readonly optional?: ControllerOptionalProps,
	) {}

	/**
	 * The POST create endpoint
	 */

	async create(req: any, body: unknown, account_id: number): Promise<T> {
		if (this.optional?.services?.authService) {
			await this.optional.services.authService.check(
				req.user.user_id,
				account_id,
				this.optional.roles?.create ? this.optional.roles.create : undefined,
			)
		}

		return await crudCreate<T>({
			service: this.service,
			data: new this.constants.entity(body),
			account_id: this.tQuery.requiresAccountId(this.service.repository) ? account_id : undefined,
		})
	}

	async findAll(req: any, query: unknown, account_id: number): Promise<T[]> {
		if (this.optional?.services?.authService) {
			await this.optional.services.authService.check(
				req.user.user_id,
				account_id,
				this.optional.roles?.create ? this.optional.roles.create : undefined,
			)
		}

		return await crudFindAll<T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: this.tQuery.requiresAccountId(this.service.repository) ? account_id : undefined,
			query: query,
			searchFields: this.constants.searchFields,
			order_by: this.constants.defaultOrderBy,
			currency:
				this.optional?.services?.fxService && this.constants.currencyField && this.constants.currencyFields?.length
					? {
							fxService: this.optional.services.fxService,
							currency_field: this.constants.currencyField,
							currency_fields: this.constants.currencyFields,
						}
					: undefined,
		})
	}

	async stats(req: any, query: any, account_id: number, method: StatsMethods): Promise<StatsResponseDto> {
		if (this.optional?.services?.authService) {
			await this.optional.services.authService.check(
				req.user.user_id,
				account_id,
				this.optional.roles?.create ? this.optional.roles.create : undefined,
			)
		}

		return await crudStats<T>({
			service: this.service,
			tQuery: this.tQuery,
			account_id: this.tQuery.requiresAccountId(this.service.repository) ? account_id : undefined,
			query: query,
			method: method,
			searchFields: this.constants.searchFields,
		})
	}

	async charts(
		req: any,
		account_id: number,
		query: any,
		search: string,
		from: string,
		to: string,
		fields: string[],
		period?: ChartsPeriod,
	): Promise<ChartsResponseDto> {
		if (this.optional?.services?.authService) {
			await this.optional.services.authService.check(
				req.user.user_id,
				account_id,
				this.optional.roles?.create ? this.optional.roles.create : undefined,
			)
		}

		return await crudCharts<T>({
			account_id: this.tQuery.requiresAccountId(this.service.repository) ? account_id : undefined,
			service: this.service,
			tQuery: this.tQuery,
			query,
			search,
			period,
			fields,
			...(from && { from: new Date(from) }),
			...(to && { to: new Date(to) }),
			searchFields: this.constants.searchFields,
			currency:
				this.optional?.services?.fxService && this.constants.currencyField && this.constants.currencyFields?.length
					? {
							fxService: this.optional.services.fxService,
							currency_field: this.constants.currencyField, // e.g. 'currency'
							currency_fields: this.constants.currencyFields, // e.g. ['subtotal_price', 'total_shipping', 'total_price']
						}
					: undefined,
		})
	}

	async findOne(req: any, account_id: number, params: any, query: any): Promise<T> {
		if (this.optional?.services?.authService) {
			await this.optional.services.authService.check(
				req.user.user_id,
				account_id,
				this.optional.roles?.create ? this.optional.roles.create : undefined,
			)
		}

		return await crudFindOne<T>({
			service: this.service,
			query: query,
			primaryKey: params[this.constants.primaryKey],
			account_id: this.tQuery.requiresAccountId(this.service.repository) ? account_id : undefined,
			currency:
				this.optional?.services?.fxService && this.constants.currencyField && this.constants.currencyFields?.length
					? {
							fxService: this.optional.services.fxService,
							currency_field: this.constants.currencyField,
							currency_fields: this.constants.currencyFields,
						}
					: undefined,
		})
	}

	async update(req: any, account_id: number, data: unknown, params: any): Promise<T> {
		if (this.optional?.services?.authService) {
			await this.optional.services.authService.check(
				req.user.user_id,
				account_id,
				this.optional.roles?.create ? this.optional.roles.create : undefined,
			)
		}

		console.log('BaseController constants', this.constants)
		console.log('BaseController Update params', params)

		return await crudUpdate<T>({
			service: this.service,
			data: new this.constants.entity(data),
			primaryKey: Number(params[this.constants.primaryKey]),
		})
	}

	async bulkUpload(
		req: any,
		params: BulkUploadDto,
		account_id: number,
		file?: Express.Multer.File,
	): Promise<BulkUploadResponse> {
		if (this.optional?.services?.authService) {
			await this.optional.services.authService.check(
				req.user.user_id,
				account_id,
				this.optional.roles?.create ? this.optional.roles.create : undefined,
			)
		}

		if (!this.constants.uploadSupportedFields) {
			throw new Error('Missing uploadSupportedFields')
		}
		if (!this.constants.uploadDedupField) {
			throw new Error('Missing uploadDedupField')
		}
		return await crudBulkUpload<T>({
			fields: this.constants.uploadSupportedFields,
			dedup_field: this.constants.uploadDedupField,
			service: this.service,
			...params,
			file: file,
		})
	}

	async uploadFileFields(): Promise<CrudUploadFieldsResponse> {
		if (!this.constants.uploadSupportedFields) {
			throw new Error('Missing uploadSupportedFields')
		}
		if (!this.constants.uploadDedupField) {
			throw new Error('Missing uploadDedupField')
		}
		return {
			fields: this.constants.uploadSupportedFields,
			dedup_field: this.constants.uploadDedupField,
		}
	}

	async remove(req: any, params: any, account_id: number): Promise<T> {
		if (this.optional?.services?.authService) {
			await this.optional.services.authService.check(
				req.user.user_id,
				account_id,
				this.optional.roles?.create ? this.optional.roles.create : undefined,
			)
		}

		switch (this.optional?.delete ?? 'DELETE') {
			case 'PURGE':
				return await crudPurge<T>({
					service: this.service,
					primaryKey: params[this.constants.primaryKey],
					account_id: this.tQuery.requiresAccountId(this.service.repository) ? account_id : undefined,
				})
			case 'DELETE':
			default:
				return await crudDelete<T>({
					service: this.service,
					primaryKey: params[this.constants.primaryKey],
					account_id: this.tQuery.requiresAccountId(this.service.repository) ? account_id : undefined,
				})
		}
	}
}
