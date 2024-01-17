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
	Logger,
} from '@juicyllama/utils'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImportMode, ControllerConstants, CrudUploadFieldsResponse, BulkUploadResponse } from '../types/common'

/**
 * Create Decorator
 */
export function CreateDecorator(options: Partial<ControllerConstants>) {
	const decorators = [
		ApiOperation({ summary: options?.name ? `Create ${Strings.capitalize(options?.name)}` : 'Create' }),
	]

	if (options?.dtos?.response) {
		decorators.push(ApiCreatedResponse(generateResponseObject(options?.dtos.response, 'Created')))
	}

	decorators.push(Post())

	return applyDecorators(...decorators)
}

/**
 * Read Decorators
 */

export function ReadManyDecorator(options: Partial<ControllerConstants>) {
	const decorators = [
		ApiOperation({ summary: options?.name ? `List ${Strings.capitalize(Strings.plural(options?.name))}` : 'List' }),
		ApiQuery({
			name: 'select',
			description: 'If you wish to specify which items you would like returning (boost performance)',
			type: [String],
			isArray: true,
			explode: false,
			required: false,
			enum: options?.selectEnum,
		}),
		ApiQuery({
			name: 'order_by',
			description: 'Order the results by a specific field',
			type: String,
			required: false,
			enum: options?.orderByEnum,
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
			enum: options?.relationsEnum,
		}),
		ApiQuery({
			name: 'search',
			description: 'Filter the results by a value',
			type: String,
			required: false,
		}),
	]

	if (options?.currencyField && options?.currencyFields?.length) {
		decorators.push(currencyFieldsDecorator(options?.currencyField, options?.currencyFields))
	}

	decorators.push(...generateSelectRHSFilteringAPIQueries(options?.selectEnum))

	if (options?.dtos?.response) {
		decorators.push(ApiOkResponse(generateResponseObject(options?.dtos.response, 'OK', true)))
	}

	decorators.push(Get())

	return applyDecorators(...decorators)
}

export function ReadStatsDecorator(options: Partial<ControllerConstants>) {
	return applyDecorators(
		ApiOperation({
			summary: options?.name ? `${Strings.capitalize(options?.name)} Stats` : 'Stats',
			description:
				'Returns calculations on the table based on your filters, for example `COUNT` will return the total number of columns matching your filters as `{count: x}`',
		}),
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

export function ReadChartsDecorator(options: Partial<ControllerConstants>) {
	const decorators = [
		ApiOperation({ summary: options?.name ? `${Strings.capitalize(options?.name)} Charts` : 'Charts' }),
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
	]

	if (options?.currencyField && options?.currencyFields?.length) {
		decorators.push(currencyFieldsDecorator(options?.currencyField, options?.currencyFields))
	}

	decorators.push(...generateSelectRHSFilteringAPIQueries(options?.selectEnum))
	decorators.push(ApiOkResponse(generateResponseObject(ChartsResponseDto, 'OK')))
	decorators.push(Get('charts'))

	return applyDecorators(...decorators)
}

export function ReadOneDecorator(options: Partial<ControllerConstants>) {
	if (!options?.primaryKey) {
		const logger = new Logger()
		logger.error('ReadOneDecorator requires a primaryKey', {
			options: options,
		})
		throw new Error('ReadOneDecorator requires a primaryKey')
	}

	const decorators = [
		ApiOperation({ summary: options?.name ? `Get ${Strings.capitalize(options?.name)}` : 'Get' }),
		ApiParam({
			name: options?.primaryKey,
			description: `The ${options?.primaryKey} for the record you wish to return`,
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
			enum: options?.selectEnum,
		}),
		ApiQuery({
			name: 'relations',
			description: 'Fetch the relations in the same request',
			type: [String],
			isArray: true,
			explode: false,
			required: false,
			enum: options?.relationsEnum,
		}),
	]

	if (options?.currencyField && options?.currencyFields?.length) {
		decorators.push(currencyFieldsDecorator(options?.currencyField, options?.currencyFields))
	}

	decorators.push(...generateSelectRHSFilteringAPIQueries(options?.selectEnum))

	if (options?.dtos?.response) {
		decorators.push(ApiOkResponse(generateResponseObject(options?.dtos.response, 'OK')))
	}

	decorators.push(Get(`:${options?.primaryKey}`))

	return applyDecorators(...decorators)
}

/**
 * Update Decorator
 */
export function UpdateDecorator(options: Partial<ControllerConstants>) {
	if (!options?.primaryKey) {
		const logger = new Logger()
		logger.error('UpdateDecorator requires a primaryKey', {
			options: options,
		})
		throw new Error('UpdateDecorator requires a primaryKey')
	}

	const decorators = [
		ApiOperation({ summary: options?.name ? `Update ${Strings.capitalize(options?.name)}` : 'Update' }),
		ApiParam({
			name: options?.primaryKey,
			description: `The ${options?.primaryKey} for the ${options?.name} you wish to return`,
			type: Number,
			required: true,
			example: 1,
		}),
	]

	if (options?.dtos?.response) {
		decorators.push(ApiOkResponse(generateResponseObject(options?.dtos.response, 'OK')))
	}

	decorators.push(Patch(`:${options?.primaryKey}`))

	return applyDecorators(...decorators)
}

export function UploadImageDecorator(options: Partial<ControllerConstants>) {
	const decorators = [
		ApiConsumes('multipart/form-data'),
		ApiQuery({
			name: 'file',
			description: 'A `jpg|jpeg|png|gif` file',
			type: 'File',
			required: true,
		}),
		UseInterceptors(FileInterceptor('file')),
	]

	if (options?.dtos?.response) {
		decorators.push(ApiOkResponse(generateResponseObject(options?.dtos.response, 'OK')))
	}

	return applyDecorators(...decorators)
}

export function UploadFileDecorator(options: Partial<ControllerConstants>) {
	const decorators = [ApiConsumes('multipart/form-data'), UseInterceptors(FileInterceptor('file'))]

	if (options?.dtos?.response) {
		decorators.push(ApiOkResponse(generateResponseObject(options?.dtos.response, 'OK')))
	}

	return applyDecorators(...decorators)
}

export function BulkUploadDecorator(options: Partial<ControllerConstants>) {
	const decorators = [
		ApiOperation({
			summary: `Bulk Upload`,
			description: `You can pass the following fields as part of the bulk upload: ${
				options?.uploadSupportedFields ? '`' + options?.uploadSupportedFields.join('`, `') + '`' : ''
			}. The following field will be used to deduplicate the records: ${
				options?.uploadDedupField ? '`' + options?.uploadDedupField + '`' : ''
			}. Duplicates work as follows:
		\n - \`${ImportMode.CREATE}\` - Any duplicates found will throw an error and the import will fail
		\n - \`${ImportMode.UPSERT}\` - Any duplicates found will be updated, any new records will be created
		\n - \`${ImportMode.REPOPULATE}\` - Clears out the table and repopulates it with the new data
		\n - \`${ImportMode.DELETE}\` - Records found based on the duplicate field will be deleted
		`,
		}),
		ApiConsumes('multipart/form-data'),
		UseInterceptors(
			FileInterceptor('file', {
				limits: {
					fieldSize: 1024 * 1024 * 50, // 50MB
					fileSize: 1024 * 1024 * 50, // 50MB
				},
			}),
		),
		ApiOkResponse({ description: 'OK', type: BulkUploadResponse }),
		Post(`upload`),
	]

	return applyDecorators(...decorators)
}

export function UploadFieldsDecorator(options: Partial<ControllerConstants>) {
	return applyDecorators(
		ApiOperation({
			summary: `Upload ${options?.name} Fields`,
			description: `This endpoint shows what fields the bulk upload supports, you should either pass these or use these as the keys in your mapper object if you are passing different values.`,
		}),
		ApiOkResponse({ description: 'OK', type: CrudUploadFieldsResponse }),
		Get(`upload/fields`),
	)
}

/**
 * Delete Decorators
 */
export function DeleteDecorator(options: Partial<ControllerConstants>) {
	if (!options?.primaryKey) {
		const logger = new Logger()
		logger.error('DeleteDecorator requires a primaryKey', {
			options: options,
		})
		throw new Error('DeleteDecorator requires a primaryKey')
	}

	const decorators = [
		ApiOperation({ summary: options?.name ? `Delete ${Strings.capitalize(options?.name)}` : 'Delete' }),
		ApiParam({
			name: options?.primaryKey,
			description: `The ${options?.primaryKey} for the ${options?.name} you wish to delete`,
			type: Number,
			required: true,
			example: 1,
		}),
	]

	if (options?.dtos?.response) {
		decorators.push(ApiOkResponse(generateResponseObject(options?.dtos.response, 'OK')))
	}

	decorators.push(Delete(`:${options?.primaryKey}`))

	return applyDecorators(...decorators)
}

function generateResponseObject(
	type: any,
	description: string,
	isArray: boolean = false,
): {
	type: any
	description: string
	isArray: boolean
} {
	return {
		type: type,
		description: description,
		isArray: isArray,
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

function currencyFieldsDecorator(
	currency_field: string, // name of field that holds the currency used. e.g. 'currency'. its value could e.g. 'USD'
	currency_fields: string[], // e.g. ['subtotal_price', 'total_shipping', 'total_price']
) {
	return ApiQuery({
		name: 'convert_currencies_to',
		description: `The currency you would like to return the results in, it will use \`${currency_field}\` and convert the values for fields: \`${currency_fields.join(
			', ',
		)}\``,
		type: String,
		required: false,
	})
}
