import { IsString, IsOptional } from 'class-validator'

export class OpenAiConfigDto {
	@IsString()
	OPENAI_API_KEY!: string

	@IsString()
	@IsOptional()
	OPENAI_ORG?: string
}
