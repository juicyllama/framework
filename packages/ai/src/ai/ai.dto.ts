import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString } from 'class-validator'
import { AiSQLTypes } from './ai.enums'
import { Repository } from 'typeorm'

export class AiRequest {
	@IsOptional()
	@IsBoolean()
	use_local_cache?: boolean
}

export class AiChatRequest extends AiRequest {
	@ApiProperty({ description: 'Your question to ask ai', example: 'How much is that doggy in the window?' })
	@IsOptional()
	@IsString()
	question?: string

	@ApiProperty({ description: 'If you are using OpenAI and wish to provide OpenAi configuration' })
	@IsOptional()
	@IsObject()
	openaiOptions?: any
}

export class AiAskSQLDto {
	@IsEnum(AiSQLTypes)
	type: AiSQLTypes

	@IsArray()
	repos: Repository<any>[]
}

export class AiSQLRequest extends AiRequest {
	@ApiProperty({ description: 'Your database query question', example: 'How many countries are there in africa?' })
	@IsString()
	question: string

	@IsObject()
	sql: AiAskSQLDto
}

export class AiImageRequest {
	@ApiProperty({ description: 'The image you would like', example: 'A cute baby sea otter' })
	@IsString()
	image_description: string

	@ApiProperty({ description: 'If you are using OpenAI and wish to provide OpenAi configuration' })
	@IsOptional()
	@IsObject()
	openaiOptions?: any
}

export class AiTrainingDataDto {
	@IsString()
	prompt: string

	@IsString()
	completion: string
}

export class AiTrainingRequestDto {
	@IsArray()
	training_data: AiTrainingDataDto[]
}
