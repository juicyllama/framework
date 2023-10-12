export enum StoreSelect {
	store_id = 'store_id',
}

export enum StoreOrderBy {
	store_id = 'store_id',
	created_at = 'created_at',
	updated_at = 'updated_at',
}

export enum StoreRelations {
	account = 'account',
	website = 'website',
	installed_app = 'installed_app',
	'installed_app.app' = 'installed_app.app',
}