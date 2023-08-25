import { IsString, IsDateString, IsNumber, IsObject, IsEnum, IsArray } from 'class-validator'
import { PartialType } from '@nestjs/swagger'
import { WordpressUserlocale } from './wordpress.users.enums'
import { WordpresContext, WordpresOrder, WordpresOrderBy } from '../wordpress.enums'

export class WordpressGetUser {
	@IsEnum(WordpresContext)
	context?: WordpresContext
}

export class WordpressListUsers {
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
	roles?: string[]

	@IsString()
	capabilities?: string

	@IsString()
	who?: string

	@IsString()
	has_published_posts?: string
}

export class WordpressUser {
	@IsNumber()
	id?: number

	@IsString()
	username?: string

	@IsString()
	name?: string

	@IsString()
	first_name?: string

	@IsString()
	last_name?: string

	@IsString()
	email?: string

	@IsString()
	url?: string

	@IsString()
	description?: string

	@IsString()
	link?: string

	@IsEnum(WordpressUserlocale)
	locale?: WordpressUserlocale

	@IsString()
	nickname?: string

	@IsString()
	slug?: string

	@IsDateString()
	registered_date?: Date

	@IsString()
	roles?: string[]

	@IsString()
	password?: string

	@IsObject()
	capabilities?: any

	@IsObject()
	extra_capabilities?: any

	@IsObject()
	avatar_urls?: any

	@IsObject()
	meta?: any
}

export class WordpressCreateUser extends WordpressUser {}

export class WordpressUpdateUser extends PartialType(WordpressUser) {}
