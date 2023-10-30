import { applyDecorators, Delete, Get, Patch, Post, UseInterceptors } from '@nestjs/common'
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger'
import {
	ChartsPeriod,
	ChartsResponseDto,
	ComparisonOperator,
	Enums,
	StatsMethods,
	StatsResponseDto,
	Strings,
} from '@juicyllama/utils'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImportMode } from '../types/common'

/**
 * Create Decorator
 */
export function CreateDecorator<T>(options: { entity: T; name: string }) {
	return applyDecorators(
		ApiOperation({ summary: options?.name ? `Create ${Strings.capitalize(options.name)}` : 'Create' }),
		ApiCreatedResponse(generateResponseObject(options.entity, 'Created')),
		Post(),
	)
}

/**
 * Read Decorators
 */

export function ReadManyDecorator<T>(options: {
	entity: T
	selectEnum: any
	orderByEnum: any
	relationsEnum?: any
	name: string
	currency_field?: string
	currency_fields?: string[]
}) {
	return applyDecorators(
		ApiOperation({ summary: options.name ? `List ${Strings.capitalize(Strings.plural(options.name))}` : 'List' }),
		ApiQuery({
			name: 'select',
			description: 'If you wish to specify which items you would like returning (boost performance)',
			type: [String],
			isArray: true,
			explode: false,
			required: false,
			enum: options.selectEnum,
		}),
		ApiQuery({
			name: 'order_by',
			description: 'Order the results by a specific field',
			type: String,
			required: false,
			enum: options.orderByEnum,
		}),
		ApiQuery({
			name: 'order_by_type',
			description: 'Either `ASC` or `DESC`',
			type: String,
			required: false,
			example: 'DESC',
		}),
		ApiQuery({
			name: 'limit',
			description: 'The number of records to return',
			type: 'number',
			required: false,
		}),
		ApiQuery({
			name: 'offset',
			description: 'The number of records to skip',
			type: 'number',
			required: false,
		}),
		ApiQuery({
			name: 'relations',
			description: 'Fetch the relations in the same request',
			type: [String],
			isArray: true,
			explode: false,
			required: false,
			enum: options.relationsEnum,
		}),
		ApiQuery({
			name: 'search',
			description: 'Filter the results by a value',
			type: String,
			required: false,
		}),
		options.currency_field && options.currency_fields?.length ? currencyFieldsDecorator(options.currency_field, options.currency_fields) : null,
		...generateSelectRHSFilteringAPIQueries(options.selectEnum),
		ApiOkResponse(generateResponseObject(options.entity, 'OK')),
		Get(),
	)
}

export function ReadStatsDecorator(options: { name: string }) {
	return applyDecorators(
		ApiOperation({ summary: options?.name ? `${Strings.capitalize(options.name)} Stats` : 'Stats' }),
		ApiQuery({
			name: 'method',
			description: `The method you would like to run, defaults to \`${StatsMethods.COUNT}\``,
			type: String,
			required: false,
			example: StatsMethods.COUNT,
			enum: [StatsMethods.COUNT],
		}),
		ApiQuery({
			name: 'search',
			description: 'Filter the results by a value',
			type: String,
			required: false,
		}),
		ApiOkResponse(generateResponseObject(StatsResponseDto, 'OK')),
		Get('stats'),
	)
}

export function ReadChartsDecorator<T>(options: {
	entity: T
	selectEnum: any
	name: string
	currency_field?: string
	currency_fields?: string[]
}) {
	return applyDecorators(
		ApiOperation({ summary: options?.name ? `${Strings.capitalize(options.name)} Charts` : 'Charts' }),
		ApiQuery({
			name: 'fields',
			description: `The fields by which you would like to group the data`,
			type: [String],
			required: false,
			example: ['first_name'],
		}),
		ApiQuery({
			name: 'from',
			description: `The date you would like to start from`,
			type: Date,
			required: false,
			example: '2023-08-08T11:21:13.406Z',
		}),
		ApiQuery({
			name: 'to',
			description: `The date you would like to end in`,
			type: Date,
			required: false,
			example: '2023-08-08T11:21:13.406Z',
		}),
		ApiQuery({
			name: 'period',
			description: `The interval you would like to group the data by. Optional, defaults to none.`,
			type: String,
			required: false,
			example: ChartsPeriod.DAY,
			enum: ChartsPeriod,
		}),
		ApiQuery({
			name: 'search',
			description: 'Filter the results by a value',
			type: String,
			required: false,
		}),
		//options.currency_field && options.currency_fields?.length ? currencyFieldsDecorator(options.currency_field, options.currency_fields) : null,
		...generateSelectRHSFilteringAPIQueries(options.selectEnum),
		ApiOkResponse(generateResponseObject(ChartsResponseDto, 'OK')),
		Get('charts'),
	)
}

export function ReadOneDecorator<T>(options: {
	entity: T
	primaryKey: string
	selectEnum: any
	relationsEnum?: any
	name: string
	currency_field?: string
	currency_fields?: string[]
}) {
	return applyDecorators(
		ApiOperation({ summary: options?.name ? `Get ${Strings.capitalize(options.name)}` : 'Get' }),
		ApiParam({
			name: options.primaryKey,
			description: `The ${options.primaryKey} for the record you wish to return`,
			type: Number,
			required: true,
			example: 1,
		}),
		ApiQuery({
			name: 'select',
			description: 'If you wish to specify which items you would like returning (boost performance)',
			type: [String],
			isArray: true,
			explode: false,
			required: false,
			enum: options.selectEnum,
		}),
		ApiQuery({
			name: 'relations',
			description: 'Fetch the relations in the same request',
			type: [String],
			isArray: true,
			explode: false,
			required: false,
			enum: options.relationsEnum,
		}),
		//options.currency_field && options.currency_fields?.length ? currencyFieldsDecorator(options.currency_field, options.currency_fields) : null,
		...generateSelectRHSFilteringAPIQueries(options.selectEnum),
		ApiOkResponse(generateResponseObject(options.entity, 'OK')),
		Get(`:${options.primaryKey}`),
	)
}

/**
 * Update Decorator
 */
export function UpdateDecorator<T>(options: { entity: T; primaryKey: string; name: string }) {
	return applyDecorators(
		ApiOperation({ summary: options?.name ? `Update ${Strings.capitalize(options.name)}` : 'Update' }),
		ApiParam({
			name: options.primaryKey,
			description: `The ${options.primaryKey} for the ${options.name} you wish to return`,
			type: Number,
			required: true,
			example: 1,
		}),
		ApiOkResponse(generateResponseObject(options.entity, 'OK')),
		Patch(`:${options.primaryKey}`),
	)
}

export function UploadImageDecorator(options: { entity: any }) {
	return applyDecorators(
		ApiConsumes('multipart/form-data'),
		ApiQuery({
			name: 'file',
			description: 'A `jpg|jpeg|png|gif` file',
			type: 'File',
			required: true,
		}),
		UseInterceptors(FileInterceptor('file')),
		ApiOkResponse(generateResponseObject(options.entity, 'OK')),
	)
}

export function UploadFileDecorator(options: { entity: any }) {
	return applyDecorators(
		ApiConsumes('multipart/form-data'),
		UseInterceptors(FileInterceptor('file')),
		ApiOkResponse(generateResponseObject(options.entity, 'OK')),
	)
}

export function BulkUploadDecorator(options: { supportedFields?: string[]; dedupField?: string }) {
	return applyDecorators(
		ApiOperation({
			summary: `Bulk Upload`,
			description: `You can pass the following fields as part of the bulk upload: ${
				options.supportedFields ? '`' + options.supportedFields.join('`, `') + '`' : ''
			}. The following field will be used to deduplicate the records: ${
				options.dedupField ? '`' + options.dedupField + '`' : ''
			}. Duplicates work as follows:
		\n - \`${ImportMode.CREATE}\` - Any duplicates found will throw an error and the import will fail
		\n - \`${ImportMode.UPSERT}\` - Any duplicates found will be updated, any new records will be created
		\n - \`${ImportMode.DELETE}\` - Records found based on the duplicate field will be deleted
		`,
		}),
		ApiConsumes('multipart/form-data'),
		UseInterceptors(FileInterceptor('file')),
		ApiOkResponse({ description: 'OK' }),
		Post(`upload`),
	)
}

export function UploadFieldsDecorator() {
	return applyDecorators(
		ApiOperation({
			summary: `Upload Fields`,
			description: `This endpoint shows what fields the bulk upload supports, you should either pass these or use these as the keys in your mapper object if you are passing different values.`,
		}),
		ApiOkResponse({ description: 'OK' }),
		Get(`upload/fields`),
	)
}

/**
 * Delete Decorators
 */
export function DeleteDecorator<T>(options: { entity: T; primaryKey: string; name: string }) {
	return applyDecorators(
		ApiOperation({ summary: options?.name ? `Delete ${Strings.capitalize(options.name)}` : 'Delete' }),
		ApiParam({
			name: options.primaryKey,
			description: `The ${options.primaryKey} for the ${options.name} you wish to delete`,
			type: Number,
			required: true,
			example: 1,
		}),
		ApiOkResponse(generateResponseObject(options.entity, 'OK')),
		Delete(`:${options.primaryKey}`),
	)
}

function generateResponseObject(
	type,
	description: string,
): {
	type: any
	description: string
} {
	return {
		type: type,
		description: description,
	}
}

function generateSelectRHSFilteringAPIQueries(selectEnum: any) {
	const selectFields = Enums.toArray(selectEnum, 'key', 'value').map(f => f.value)
	const comparisonOperators = Enums.toArray(ComparisonOperator, 'key', 'value').map(f => `\`${f.value}\``)
	return selectFields.map(f =>
		ApiQuery({
			name: f,
			description: `Filter results by \`${f}\`. Example values: \`EQ:Tom\`, \`GT:7\`. Possible operators: ${comparisonOperators.join(
				', ',
			)}`,
			type: String,
			required: false,
		}),
	)
}

function currencyFieldsDecorator(currency_field: string, currency_fields: string[]) {
	return ApiQuery({
		name: 'convert_currencies_to',
		description: `The currency you would like to return the results in, it will use \`${currency_field}\` and convert the values for fields: \`${currency_fields.join(
			', ',
		)}\``,
		type: String,
		required: false,
	})
}
