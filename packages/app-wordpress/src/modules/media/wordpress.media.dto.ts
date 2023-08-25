import { IsString, IsUrl, IsDateString, IsNumber, IsObject, IsEnum, IsArray } from 'class-validator'
import { WordpresMediaStatus, WordpressMediaType } from './wordpress.media.enums'
import { WordpressLinks, WordpressMeta, WordpressRenderedObject } from '../wordpress.dto'
import {
	WordpresContext,
	WordpresOrder,
	WordpresOrderBy,
	WordpressCommentStatus,
	WordpressPingStatus,
} from '../wordpress.enums'
import { PartialType } from '@nestjs/swagger'

export class WordpressListMedia {
	@IsEnum(WordpresContext)
	context?: WordpresContext

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

	@IsEnum(WordpresOrder)
	order?: WordpresOrder

	@IsEnum(WordpresOrderBy)
	orderby?: WordpresOrderBy

	@IsString()
	slug?: string

	@IsString()
	status?: string

	@IsEnum(WordpressMediaType)
	media_type?: WordpressMediaType

	@IsString()
	mime_type?: string
}

export class WordpressGetMedia {
	@IsEnum(WordpresContext)
	context?: WordpresContext
}

export class WordPressMediaDetailsSize {
	@IsString()
	file: string

	@IsNumber()
	width: number

	@IsNumber()
	height: number

	@IsNumber()
	filesize: number

	@IsString()
	mime_type: string

	@IsString()
	source_url: string
}

export class WordPressMediaDetailsSizes {
	@IsObject()
	medium: WordPressMediaDetailsSize

	@IsObject()
	thumbnail: WordPressMediaDetailsSize

	@IsObject()
	full: WordPressMediaDetailsSize
}

export class WordPressMediaDetailsImageMeta {
	@IsString()
	aperture?: string

	@IsString()
	credit?: string

	@IsString()
	camera?: string

	@IsString()
	caption?: string

	@IsString()
	created_timestamp?: string

	@IsString()
	copyright?: string

	@IsString()
	focal_length?: string

	@IsString()
	iso?: string

	@IsString()
	shutter_speed?: string

	@IsString()
	title?: string

	@IsString()
	orientation?: string

	@IsString()
	keywords?: string[]
}

export class WordPressMediaDetails {
	@IsNumber()
	width?: number

	@IsNumber()
	height?: number

	@IsString()
	file?: string

	@IsNumber()
	filesize?: number

	@IsObject()
	sizes?: WordPressMediaDetailsSizes

	@IsObject()
	image_meta?: WordPressMediaDetailsImageMeta
}

export class WordpressMedia {
	@IsNumber()
	id?: number

	@IsDateString()
	date?: Date

	@IsDateString()
	date_gmt?: Date

	@IsObject()
	guid?: WordpressRenderedObject

	@IsDateString()
	modified?: Date

	@IsDateString()
	modified_gmt?: Date

	@IsString()
	slug?: string

	@IsEnum(WordpresMediaStatus)
	status?: WordpresMediaStatus

	@IsString()
	type?: string

	@IsUrl()
	link?: string

	@IsObject()
	title: WordpressRenderedObject

	@IsNumber()
	author?: number

	@IsEnum(WordpressCommentStatus)
	comment_status?: WordpressCommentStatus

	@IsEnum(WordpressPingStatus)
	ping_status?: WordpressPingStatus

	@IsString()
	template?: string

	@IsArray()
	meta?: WordpressMeta[]

	@IsObject()
	description: WordpressRenderedObject

	@IsObject()
	caption: WordpressRenderedObject

	@IsString()
	alt_text?: string

	@IsEnum(WordpressMediaType)
	media_type?: WordpressMediaType

	@IsString()
	mime_type?: string

	@IsObject()
	media_details?: WordPressMediaDetails

	@IsNumber()
	post?: number

	@IsString()
	source_url?: string

	@IsObject()
	_links?: WordpressLinks
}

export class WordpressCreateMedia {
	@IsString()
	slug?: string

	@IsEnum(WordpresMediaStatus)
	status?: WordpresMediaStatus

	@IsString()
	title?: string

	@IsNumber()
	author?: number

	@IsString()
	template?: string

	@IsArray()
	meta?: WordpressMeta[]

	@IsString()
	description?: string

	@IsString()
	caption?: string

	@IsString()
	alt_text?: string

	@IsNumber()
	post?: number
}

export class WordpressUpdateMedia extends PartialType(WordpressCreateMedia) {}
