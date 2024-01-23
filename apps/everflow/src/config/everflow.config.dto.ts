import { IsString } from 'class-validator'

export class everflowConfigDto {
	@IsString()
	EVERFLOW_API_KEY!: string
}
