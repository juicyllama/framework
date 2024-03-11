import { IsString } from 'class-validator'

export class SemrushConfigDto {
	@IsString()
	SEMRUSH_API_KEY!: string
}
