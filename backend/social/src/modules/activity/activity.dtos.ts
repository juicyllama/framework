import { IsOptional, IsJSON, IsNumber, IsDateString } from 'class-validator'

export class PutActivityDto {
	@IsOptional()
	@IsJSON()
	json?: any

	@IsOptional()
	@IsNumber()
	streak?: number

	@IsOptional()
	@IsDateString()
	last_seen_at?: Date
}
