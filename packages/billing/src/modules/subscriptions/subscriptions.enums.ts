export enum SubscriptionSelect {
	subscription_id = 'subscription_id',
	name = 'name',
	description = 'description',
	pricing = 'pricing',
	frequency = 'frequency',
	created_at = 'created_at',
	next_rebill_at = 'next_rebill_at',
	paused_at = 'paused_at',
}

export enum SubscriptionOrderBy {
	subscription_id = 'subscription_id',
	name = 'name',
	frequency = 'frequency',
	created_at = 'created_at',
	next_rebill_at = 'next_rebill_at',
	paused_at = 'paused_at',
}

export enum SubscriptionRelations {
	account = 'account',
	added_by = 'added_by',
	tags = 'tags',
}
