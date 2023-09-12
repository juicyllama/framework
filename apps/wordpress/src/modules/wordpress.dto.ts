import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator'

export class WordpressLink {
	@IsString()
	href: string

	@IsBoolean()
	embeddable?: boolean

	@IsNumber()
	count?: number

	@IsNumber()
	id?: number

	@IsString()
	taxonomy?: string
}

export class WordpressMeta {
	@IsString()
	key?: string

	@IsString()
	value?: string
}

export class WordpressRenderedObject {
	@IsString()
	rendered: string

	@IsBoolean()
	protected?: boolean
}

export class WordpressLinks {
	@IsArray()
	self: WordpressLink[]

	@IsArray()
	collection: WordpressLink[]

	@IsArray()
	about: WordpressLink[]

	@IsArray()
	auther: WordpressLink[]

	@IsArray()
	replies: WordpressLink[]

	@IsArray()
	'version-history': WordpressLink[]

	@IsArray()
	'predecessor-version': WordpressLink[]

	@IsArray()
	'wp:attachment': WordpressLink[]

	@IsArray()
	'wp:term': WordpressLink[]
}
