import { IsDateString } from 'class-validator'

export class DateRangeDto {
	@IsDateString()
	from!: Date

	@IsDateString()
	to!: Date
}
