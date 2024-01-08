export enum ContactSelect {
	contact_id = 'contact_id',
	first_name = 'first_name',
	last_name = 'last_name',
	avatar_type = 'avatar_type',
	avatar_image_url = 'avatar_image_url',
	dob = 'dob',
	created_at = 'created_at',
	updated_at = 'updated_at',
	name = 'name',
	tags_array = 'tags_array',
}

export enum ContactOrderBy {
	contact_id = 'contact_id',
	first_name = 'first_name',
	last_name = 'last_name',
	dob = 'dob',
	created_at = 'created_at',
	updated_at = 'updated_at',
}

export enum ContactRelations {
	account = 'account',
	added_by = 'added_by',
	emails = 'emails',
	phones = 'phones',
	socials = 'socials',
	addresses = 'addresses',
	tags = 'tags',
}

export enum ContactSubscriptionStatus {
	subscribed = 'subscribed',
	unsubscribed = 'unsubscribed',
	pending = 'pending',
}
