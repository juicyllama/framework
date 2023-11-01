import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { InsertResult, DeleteResult } from 'typeorm'

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

export type CrudUploadFieldsResponse = { fields: string[]; dedup_field: string }

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
		description: `Pass raw contents to upload, Defaults to \`${UploadType.CSV}\` string`,
		type: 'any',
		required: false,
	})
	raw?: any

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

export type BulkUploadResponse = InsertResult | DeleteResult

export interface ChartResult {
	count: number
	[key: string]: any
	time_interval: Date
	currency?: string | null
}