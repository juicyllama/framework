import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

//todo move to core to decorate all responses with @ApiProperty({ description: 'The tag ID', example: 1 })

export class ErrorResponseDto {
	@IsNumber()
	statusCode: number

	@IsArray()
	message: string[]

	@IsString()
	error: string
}
export class StatsResponseDto {
	@IsNumber()
	@IsOptional()
	count?: number

	@IsNumber()
	@IsOptional()
	avg?: number

	@IsNumber()
	@IsOptional()
	sum?: number
}

interface ChartCarthesianDataSetPoint {
	x?: string
	y?: number
}

interface ChartDataSetElement {
	backgroundColor?: string
	label?: string
	data: number[]
}

export class ChartsResponseDto {
	@IsArray()
	labels?: string[]
	@IsArray()
	datasets?: ChartDataSetElement[]
}

export class InvoicesSummaryResponseDto {
	@IsString()
	dateFrom?: number

	@IsString()
	dateTo?: number

	@IsNumber()
	@IsOptional()
	datasets?: ChartDataSetElement[]
}

export class SuccessResponseDto {
	@IsBoolean()
	success: boolean
}

export class ProcessedResponseDto {
	@IsNumber()
	created: number

	@IsNumber()
	updated: number

	@IsNumber()
	deleted: number
}

export interface CronRecords {
	todo: number
	processed: number
	remaining: number
}
