import { IsString, IsNumber, IsObject, IsEnum, IsArray } from 'class-validator'
import { PartialType } from '@nestjs/swagger'
import { WordpresContext, WordpresOrder, WordpresOrderBy } from '../wordpress.enums'

export class WordpressGetCategory {
	@IsEnum(WordpresContext)
	context?: WordpresContext
}

export class WordpressListCategories {
	@IsEnum(WordpresContext)
	context?: WordpresContext

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

	@IsEnum(WordpresOrder)
	order?: WordpresOrder

	@IsEnum(WordpresOrderBy)
	orderby?: WordpresOrderBy

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
