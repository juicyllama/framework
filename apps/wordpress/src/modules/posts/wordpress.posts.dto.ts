import { PartialType } from '@nestjs/swagger'
import { IsString, IsUrl, IsDateString, IsBoolean, IsNumber, IsObject, IsEnum, IsArray } from 'class-validator'
import { WordpressLinks, WordpressMeta, WordpressRenderedObject } from '../wordpress.dto'
import {
	WordpressContext,
	WordpressOrder,
	WordpressOrderBy,
	WordpressCommentStatus,
	WordpressPingStatus,
} from '../wordpress.enums'
import { WordpresPostStatus, WordpressPostFormat } from './wordpress.posts.enums'

export class WordpressListPosts {
	@IsEnum(WordpressContext)
	context?: WordpressContext

	@IsNumber()
	page?: number

	@IsNumber()
	per_page?: number

	@IsString()
	search?: string

	@IsArray()
	search_columns?: string[]

	@IsString()
	after?: string

	@IsString()
	before?: string

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
	status?: string

	@IsString()
	categories?: string

	@IsString()
	categories_exclude?: string

	@IsString()
	tags?: string

	@IsString()
	tags_exclude?: string

	@IsBoolean()
	sticky?: boolean
}

export class WordpressPostTag {
	@IsNumber()
	id!: number

	@IsString()
	name!: string

	@IsString()
	slug!: string

	@IsString()
	description!: string

	@IsNumber()
	parent!: number

	@IsNumber()
	count!: number

	@IsString()
	link!: string
}

export class WordpressGetPost {
	@IsEnum(WordpressContext)
	context?: WordpressContext

	@IsString()
	password?: string
}

export class WordpressPost {
	@IsDateString()
	date?: Date

	@IsDateString()
	date_gmt?: Date

	@IsObject()
	guid?: WordpressRenderedObject

	@IsNumber()
	id?: number

	@IsUrl()
	link?: string

	@IsDateString()
	modified?: Date

	@IsDateString()
	modified_gmt?: Date

	@IsString()
	slug?: string

	@IsEnum(WordpresPostStatus)
	status?: WordpresPostStatus

	@IsString()
	type?: string

	@IsString()
	password?: string

	@IsString()
	permalink_template?: string

	@IsString()
	generated_slug?: string

	@IsObject()
	title!: WordpressRenderedObject

	@IsObject()
	content!: WordpressRenderedObject

	@IsObject()
	excerpt?: WordpressRenderedObject

	@IsNumber()
	author?: number

	@IsNumber()
	featured_media?: number

	@IsEnum(WordpressCommentStatus)
	comment_status?: WordpressCommentStatus

	@IsEnum(WordpressPingStatus)
	ping_status?: WordpressPingStatus

	@IsEnum(WordpressPostFormat)
	format?: WordpressPostFormat

	@IsArray()
	meta?: WordpressMeta[]

	@IsBoolean()
	sticky?: boolean

	@IsString()
	template?: string

	@IsArray()
	categories?: number[]

	@IsArray()
	tags?: WordpressPostTag[]

	@IsObject()
	_links?: WordpressLinks
}

export class WordpressCreatePost {
	@IsDateString()
	date?: Date

	@IsDateString()
	date_gmt?: Date

	@IsString()
	slug?: string

	@IsEnum(WordpresPostStatus)
	status?: WordpresPostStatus

	@IsString()
	type?: string

	@IsString()
	password?: string

	@IsString()
	permalink_template?: string

	@IsString()
	title!: string

	@IsString()
	content!: string

	@IsString()
	excerpt?: string

	@IsNumber()
	author?: number

	@IsNumber()
	featured_media?: number

	@IsEnum(WordpressPostFormat)
	format?: WordpressPostFormat

	@IsBoolean()
	sticky?: boolean

	@IsString()
	template?: string

	@IsArray()
	categories?: number[]

	@IsArray()
	tags?: WordpressPostTag[]
}

export class WordpressUpdatePost extends PartialType(WordpressCreatePost) {}
