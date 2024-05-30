import { IsNumber, IsArray, IsJSON, IsOptional, IsString } from 'class-validator'

export class CreatePostDto {
	@IsString()
	message!: string

	@IsNumber()
	@IsOptional()
	parent_post_id?: number

	@IsArray()
	@IsOptional()
	tags?: string[]

	@IsJSON()
	@IsOptional()
	json?: any
}

export class UpdatePostDto {
	@IsString()
	message?: string

	@IsJSON()
	@IsOptional()
	json?: any
}

export class PostLikeDto {
	@IsJSON()
	@IsOptional()
	json?: any
}

export class ReportPostDto {
	@IsString()
	message!: string

	@IsJSON()
	@IsOptional()
	json?: any
}
