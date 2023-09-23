import { IsDateString } from 'class-validator'

export class DateRangeDto {
	@IsDateString()
	from: Date = new Date()

	@IsDateString()
	to: Date = new Date()
}
