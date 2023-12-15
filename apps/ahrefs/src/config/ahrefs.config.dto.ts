import { IsString } from 'class-validator'

export class AhrefsConfigDto {
	@IsString()
	AHREFS_API_KEY: string
}
