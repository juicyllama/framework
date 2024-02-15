import { SupportedCurrencies } from '@juicyllama/utils'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { AuthService } from '../modules/auth/auth.service'
import { FxService } from '../modules/fx/fx.service'
import { UserRole } from '../modules/users/users.enums'

export enum UploadType {
	CSV = 'CSV',
	JSON = 'JSON',
}

export enum HTTP_METHODS {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

export enum CRUD_ACTIONS {
	CREATE = 'CREATE',
	READ = 'READ',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE',
}

export enum METHOD {
	CREATE = 'CREATE', // CREATE
	GET = 'GET', // READ ONE
	LIST = 'LIST', //  READ MANY
	COUNT = 'COUNT', // READ MANY COUNT
	POST = 'POST', // ALIAS FOR CREATE
	PUT = 'PUT', // CREATE OR UPDATE
	UPDATE = 'UPDATE', // UPDATE
	UPLOAD = 'UPLOAD', // UPLOAD
	PATCH = 'PATCH', // UPDATE
	DELETE = 'DELETE', // DELETE
	CHARTS = 'CHARTS', //  READ MANY
}

export interface PromiseLoopOutcomes<T> {
	total: number
	success: number
	failed: number
	failures?: PromiseSettledResult<T>[]
}

export class CrudUploadFieldsResponse {
	@ApiProperty({
		name: 'fields',
		example: ['first_name', 'last_name', 'email'],
	})
	fields!: string[]

	@ApiProperty({
		name: 'dedup_field',
		example: 'email',
	})
	dedup_field!: string
}

export enum ImportMode {
	CREATE = 'CREATE',
	UPSERT = 'UPSERT',
	DELETE = 'DELETE',
	REPOPULATE = 'REPOPULATE',
}

export class BulkUploadDto {
	@ApiProperty({
		name: 'file',
		description: 'A file, currently supports: `.csv` `.json`',
		type: 'File',
		required: false,
	})
	file?: Express.Multer.File

	@ApiProperty({
		name: 'raw',
		description: `Pass raw contents to upload as a string. If you pass a JSON string, it will be parsed to an object.`,
		type: 'String',
		required: false,
	})
	@IsOptional()
	@IsString()
	raw?: string

	@ApiProperty({
		name: 'upload_type',
		description: `The type of file you are uploading. Defaults to \`${UploadType.CSV}\``,
		type: 'Enum',
		enum: UploadType,
		required: false,
	})
	@IsEnum(UploadType)
	@IsOptional()
	upload_type?: UploadType

	@ApiProperty({
		name: 'import_mode',
		description: `The type of file you are uploading. Defaults to \`${ImportMode.CREATE}\` \n - \`${ImportMode.CREATE}\` - Create new records, will error if it includes duplicates \n - \`${ImportMode.UPSERT}\` - Create or Update records \n - \`${ImportMode.DELETE}\` - Delete records \n - \`${ImportMode.REPOPULATE}\` - Delete all records and repopulate with new records`,
		type: 'Enum',
		enum: ImportMode,
		required: false,
	})
	@IsEnum(ImportMode)
	@IsOptional()
	import_mode?: ImportMode

	@ApiProperty({
		name: 'mappers',
		description: `If your fields do not match the database fields, you can map them here. \n Example: \n
		\{
			"someClientFieldName": "first_name",
			"this.could.be.anything": "last_name"
		}\
		`,
		type: 'Object',
		required: false,
	})
	@IsOptional()
	mappers?: { [key: string]: string }
}

export class BulkUploadResponse {
	@ApiProperty({
		name: 'total',
		description: 'The total number of records to process',
		type: 'Number',
		required: true,
		example: 100,
	})
	total!: number

	@ApiProperty({
		name: 'processed',
		description: 'The total number of records processed',
		type: 'Number',
		required: true,
		example: 100,
	})
	processed!: number

	@ApiProperty({
		name: 'created',
		description: 'The total number of records created',
		type: 'Number',
		required: true,
		example: 80,
	})
	created!: number

	@ApiProperty({
		name: 'updated',
		description: 'The total number of records updated',
		type: 'Number',
		required: true,
		example: 20,
	})
	updated!: number

	@ApiProperty({
		name: 'deleted',
		description: 'The total number of records deleted',
		type: 'Number',
		required: true,
		example: 0,
	})
	deleted!: number

	@ApiProperty({
		name: 'errored',
		description: 'The total number of records errored',
		type: 'Number',
		required: true,
		example: 0,
	})
	errored!: number

	@ApiProperty({
		name: 'errors',
		description: 'The array of errors',
		type: 'Array',
		required: false,
		example: ['Error 1', 'Error 2'],
	})
	errors?: any[]

	@ApiProperty({
		name: 'ids',
		description: 'The primary keys of the records processed',
		type: 'Array',
		required: false,
		example: [1, 2, 3, 4],
	})
	ids!: number[]
}

export interface ChartResult {
	count: number
	[key: string]: any
	time_interval: Date
	currency?: SupportedCurrencies // e.g 'USD'
}

export type ControllerOptionalProps = {
	roles?: ControllerRoles
	services?: {
		authService?: AuthService
		fxService?: FxService
	}
	delete?: 'DELETE' | 'PURGE' // defaults to DELETE
}

export type ControllerConstants = {
	entity: any
	name: string
	primaryKey: string
	searchFields: string[]
	defaultOrderBy?: string
	selectEnum?: any
	orderByEnum?: any
	relationsEnum?: any
	currencyField?: string // e.g 'currency'. in a given entity, this field's value contains a SupportedCurrency e.g. 'USD'
	currencyFields?: string[] // the fields that hold numeric values in the currency e.g. '123.45'  e.g. ['subtotal_price', 'total_shipping', 'total_price']
	geoFields?: string[] // e.g. 'country' the ISO2 country code e.g. 'US'
	langFields?: string[] // e.g. 'language' the ISO2 language code e.g. 'en'
	uploadSupportedFields?: string[]
	uploadDedupField?: string
	dtos?: {
		base?: any
		create?: any
		update?: any
		response?: any
	}
}

export type ControllerRoles = {
	create?: UserRole[]
	findOne?: UserRole[]
	findAll?: UserRole[]
	stats?: UserRole[]
	charts?: UserRole[]
	update?: UserRole[]
	delete?: UserRole[]
	purge?: UserRole[]
}

export class BaseResponseDto {
	@ApiProperty({
		name: 'created_at',
		description: 'The date the record was created',
		type: 'Date',
		required: true,
	})
	created_at?: Date

	@ApiProperty({
		name: 'updated_at',
		description: 'The date the record was last updated',
		type: 'Date',
		required: true,
	})
	updated_at?: Date
}
