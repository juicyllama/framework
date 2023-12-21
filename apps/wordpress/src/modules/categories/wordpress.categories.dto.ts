import { PartialType } from '@nestjs/swagger'
import { IsString, IsNumber, IsObject, IsEnum, IsArray } from 'class-validator'
import { WordpressContext, WordpressOrder, WordpressOrderBy } from '../wordpress.enums'

export class WordpressGetCategory {
	@IsEnum(WordpressContext)
	context?: WordpressContext
}

export class WordpressListCategories {
	@IsEnum(WordpressContext)
	context?: WordpressContext

	@IsNumber()
	page?: number

	@IsNumber()
	per_page?: number

	@IsString()
	search?: string

	@IsArray()
	exclude?: number[]

	@IsArray()
	include?: number[]

	@IsArray()
	offset?: number[]

	@IsEnum(WordpressOrder)
	order?: WordpressOrder

	@IsEnum(WordpressOrderBy)
	orderby?: WordpressOrderBy

	@IsString()
	slug?: string

	@IsString()
	hide_empty?: string

	@IsString()
	parent?: string

	@IsString()
	post?: string
}

export class WordpressCategory {
	@IsNumber()
	id?: number

	@IsString()
	integer?: number

	@IsString()
	description?: string

	@IsString()
	link?: string

	@IsString()
	name?: string

	@IsString()
	slug?: string

	@IsString()
	taxonomy?: string

	@IsString()
	parent?: number

	@IsObject()
	meta?: any
}

export class WordpressCreateCategory extends WordpressCategory {}

export class WordpressUpdateCategory extends PartialType(WordpressCategory) {}
