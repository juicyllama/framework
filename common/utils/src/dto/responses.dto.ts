import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

//todo move to types (package/core)
//todo move to core to decorate all responses with @ApiProperty({ description: 'The tag ID', example: 1 })

export class ErrorResponseDto {
	@IsNumber()
	statusCode!: number

	@IsArray()
	message!: string[]

	@IsString()
	error!: string
}
export class StatsResponseDto {
	@ApiProperty({ name: 'count', example: 0 })
	@IsNumber()
	@IsOptional()
	count?: number

	@ApiProperty({ name: 'avg', example: 0 })
	@IsNumber()
	@IsOptional()
	avg?: number

	@ApiProperty({ name: 'sum', example: 0 })
	@IsNumber()
	@IsOptional()
	sum?: number
}

interface ChartDataSetPoint {
	x?: string
	y?: number
}

interface ChartDataSetElement {
	backgroundColor?: string
	label?: string
	data: ChartDataSetPoint[]
}

export class ChartsResponseDto {
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
	success!: boolean
}

export class ProcessedResponseDto {
	@IsNumber()
	created!: number

	@IsNumber()
	updated!: number

	@IsNumber()
	deleted!: number
}

export interface CronRecords {
	todo: number
	processed: number
	remaining: number
}
