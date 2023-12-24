import { ControllerConstants } from '../../types/common'
import { TagDto, CreateTagDto, UpdateTagDto, TagResponceDto } from './tags.dtos'
import { Tag } from './tags.entity'
import { TagsSelect, TagsOrderBy, TagsRelations } from './tags.enum'

export const TAGS_E = Tag
export type TAGS_T = Tag
export const TAGS_NAME = 'tag'
export const TAGS_SEARCH_FIELDS = ['name']
export const TAGS_DEFAULT_ORDER_BY = 'name'
export const TAGS_PRIMARY_KEY = 'tag_id'

export const tagsConstants: ControllerConstants = {
	entity: TAGS_E,
	name: TAGS_NAME,
	primaryKey: TAGS_PRIMARY_KEY,
	searchFields: TAGS_SEARCH_FIELDS,
	defaultOrderBy: TAGS_DEFAULT_ORDER_BY,
	selectEnum: TagsSelect,
	orderByEnum: TagsOrderBy,
	relationsEnum: TagsRelations,
	dtos: {
		base: TagDto,
		create: CreateTagDto,
		update: UpdateTagDto,
		response: TagResponceDto,
	},
}
