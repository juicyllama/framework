import { IsString } from 'class-validator'

export class PexelsConfigDto {
	@IsString()
	PEXELS_API_KEY: string
}
