import { IsString } from 'class-validator'

export class EverflowConfigDto {
	@IsString()
	EVERFLOW_API_KEY!: string
}
