import { ControllerConstants } from '@juicyllama/core'
import { Post } from './posts.entity'
import { PostsOrderBy, PostsRelations, PostsSelect } from './posts.enums'

export const POSTS_E = Post
export type POSTS_T = Post
export const POSTS_PRIMARY_KEY = 'post_id'
export const POSTS_NAME = 'posts'
export const POSTS_SEARCH_FIELDS = []
export const POSTS_DEFAULT_ORDER_BY = 'created_at'
export const POSTS_WEBSOCKET_EVENT = 'user_${user_id}_social_posts'
export const POSTS_ENDPOINT = '/social/posts'

export const postsConstants: ControllerConstants = {
	entity: POSTS_E,
	name: POSTS_NAME,
	primaryKey: POSTS_PRIMARY_KEY,
	searchFields: POSTS_SEARCH_FIELDS,
	defaultOrderBy: POSTS_DEFAULT_ORDER_BY,
	selectEnum: PostsSelect,
	orderByEnum: PostsOrderBy,
	relationsEnum: PostsRelations,
}
