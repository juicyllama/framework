import { IsOptional, IsString } from 'class-validator'

export class AhrefsConfigDto {
	@IsOptional()
	@IsString()
	AHREFS_API_KEY: string
}
