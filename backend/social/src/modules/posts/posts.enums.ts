export enum PostsSelect {
	post_id = 'post_id',
	message = 'message',
	parent_post_id = 'parent_post_id',
	tags = 'tags',
	json = 'json',
	created_at = 'created_at',
	updated_at = 'updated_at',
}

export enum PostsOrderBy {
	post_id = 'post_id',
	parent_post_id = 'parent_post_id',
	created_at = 'created_at',
	updated_at = 'updated_at',
}

export enum PostsRelations {
	user = 'user',
	parent_post = 'parent_post',
	child_posts = 'child_posts',
	complaints = 'complaints',
	likes = 'likes',
	tags = 'tags',
}
