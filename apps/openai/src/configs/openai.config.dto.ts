import { IsString } from 'class-validator'

export class OpenAiConfigDto {
	@IsString()
	OPENAI_API_KEY: string
}
