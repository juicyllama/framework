import { IsString } from 'class-validator'

export class SpyfuConfigDto {
	@IsString()
	SPYFU_API_KEY!: string
}
