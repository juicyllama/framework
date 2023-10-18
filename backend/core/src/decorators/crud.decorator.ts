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
 * Update Decorator
 */
export function CreateDecorator<T>(E: T, name?: string) {
	return applyDecorators(
		ApiOperation({ summary: `Create ${Strings.capitalize(name)}` }),
		ApiCreatedResponse(generateResponseObject(E, 'Created')),
		Post(),
	)
}

export function ReadManyDecorator(E, SelectEnum: any, OrderByEnum: any, RelationsEnum: any, name?: string) {
	return applyDecorators(
		ApiOperation({ summary: name ? `List ${Strings.capitalize(Strings.plural(name))}` : 'List' }),
		ApiQuery({
			name: 'select',
			description: 'If you wish to specify which items you would like returning (boost performance)',
			type: [String],
			isArray: true,
			explode: false,
			required: false,
			enum: SelectEnum,
		}),
		ApiQuery({
			name: 'order_by',
			description: 'Order the results by a specific field',
			type: String,
			required: false,
			enum: OrderByEnum,
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
			enum: RelationsEnum,
		}),
		ApiQuery({
			name: 'search',
			description: 'Filter the results by a value',
			type: String,
			required: false,
		}),
		...generateSelectRHSFilteringAPIQueries(SelectEnum),
		ApiOkResponse(generateResponseObject(E, 'OK')),
		Get(),
	)
}

export function ReadStatsDecorator(name?: string) {
	return applyDecorators(
		ApiOperation({ summary: name ? `${Strings.capitalize(name)} Stats` : 'Stats' }),
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

export function ReadChartsDecorator(E, SelectEnum, name?: string) {
	return applyDecorators(
		ApiOperation({ summary: name ? `${Strings.capitalize(name)} Charts` : 'Charts' }),
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
			enum: [
				ChartsPeriod.MIN,
				ChartsPeriod['15MIN'],
				ChartsPeriod['30MIN'],
				ChartsPeriod.HOUR,
				ChartsPeriod.DAY,
				ChartsPeriod.WEEK,
				ChartsPeriod.MONTH,
				ChartsPeriod.YEAR,
			],
		}),
		ApiQuery({
			name: 'search',
			description: 'Filter the results by a value',
			type: String,
			required: false,
		}),
		...generateSelectRHSFilteringAPIQueries(SelectEnum),
		ApiOkResponse(generateResponseObject(ChartsResponseDto, 'OK')),
		Get('charts'),
	)
}

export function ReadOneDecorator(E, PRIMARY_KEY: string, SelectEnum: any, RelationsEnum: any, name?: string) {
	return applyDecorators(
		ApiOperation({ summary: `Get ${Strings.capitalize(name)}` }),
		ApiParam({
			name: PRIMARY_KEY,
			description: `The ${PRIMARY_KEY} for the record you wish to return`,
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
			enum: SelectEnum,
		}),
		ApiQuery({
			name: 'relations',
			description: 'Fetch the relations in the same request',
			type: [String],
			isArray: true,
			explode: false,
			required: false,
			enum: RelationsEnum,
		}),
		...generateSelectRHSFilteringAPIQueries(SelectEnum),
		ApiOkResponse(generateResponseObject(E, 'OK')),
		Get(`:${PRIMARY_KEY}`),
	)
}

/**
 * Update Decorator
 */
export function UpdateDecorator(E, PRIMARY_KEY: string, name?: string) {
	return applyDecorators(
		ApiOperation({ summary: `Update ${Strings.capitalize(name)}` }),
		ApiParam({
			name: PRIMARY_KEY,
			description: `The ${PRIMARY_KEY} for the ${name} you wish to return`,
			type: Number,
			required: true,
			example: 1,
		}),
		ApiOkResponse(generateResponseObject(E, 'OK')),
		Patch(`:${PRIMARY_KEY}`),
	)
}

export function UploadImageDecorator(E: any) {
	return applyDecorators(
		ApiConsumes('multipart/form-data'),
		ApiQuery({
			name: 'file',
			description: 'A `jpg|jpeg|png|gif` file',
			type: 'File',
			required: true,
		}),
		UseInterceptors(FileInterceptor('file')),
		ApiOkResponse(generateResponseObject(E, 'OK')),
	)
}

export function BulkFileUploadDecorator(supported_fields?: string[], dedup_field?: string) {
	return applyDecorators(
		ApiOperation({
			summary: `Bulk File Upload`,
			description: `You can pass the following fields as part of the bulk upload: ${
				supported_fields ? '`' + supported_fields.join('`, `') + '`' : ''
			}. The following field will be used to deduplicate the records: ${
				dedup_field ? '`' + dedup_field + '`' : ''
			}. Duplicates work as follows:
		\n - \`${ImportMode.CREATE}\` - Any duplicates found will throw an error and the import will fail
		\n - \`${ImportMode.UPSERT}\` - Any duplicates found will be updated, any new records will be created
		\n - \`${ImportMode.DELETE}\` - Records found based on the duplicate field will be deleted
		`,
		}),
		ApiConsumes('multipart/form-data'),
		UseInterceptors(FileInterceptor('file')),
		ApiOkResponse({ description: 'OK' }),
		Post(`upload/file`),
	)
}

export function BulkUploadDecorator(supported_fields?: string[], dedup_field?: string) {
	return applyDecorators(
		ApiOperation({
			summary: `Bulk Upload`,
			description: `You can pass the following fields as part of the bulk upload: ${
				supported_fields ? '`' + supported_fields.join('`, `') + '`' : ''
			}. The following field will be used to deduplicate the records: ${
				dedup_field ? '`' + dedup_field + '`' : ''
			}. Duplicates work as follows:
		\n - \`${ImportMode.CREATE}\` - Any duplicates found will throw an error and the import will fail
		\n - \`${ImportMode.UPSERT}\` - Any duplicates found will be updated, any new records will be created
		\n - \`${ImportMode.DELETE}\` - Records found based on the duplicate field will be deleted
		`,
		}),
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
 * Update Decorator
 */
export function DeleteDecorator(E, PRIMARY_KEY: string, name?: string) {
	return applyDecorators(
		ApiOperation({ summary: `Delete ${Strings.capitalize(name)}` }),
		ApiParam({
			name: PRIMARY_KEY,
			description: `The ${PRIMARY_KEY} for the ${name} you wish to delete`,
			type: Number,
			required: true,
			example: 1,
		}),
		ApiOkResponse(generateResponseObject(E, 'OK')),
		Delete(`:${PRIMARY_KEY}`),
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

function generateSelectRHSFilteringAPIQueries(SelectEnum: any) {
	const selectFields = Enums.toArray(SelectEnum, 'key', 'value').map(f => f.value)
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
