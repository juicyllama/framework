export enum InstalledAppsSelect {
	installed_app_id = 'installed_app_id',
	app_id = 'app_id',
	account_id = 'account_id',
	user_id = 'user_id',
	name = 'name',
	settings = 'settings',
	integration_status = 'integration_status',
	active = 'active',
	created_at = 'created_at',
	updated_at = 'updated_at',
}

export enum InstalledAppsOrderBy {
	installed_app_id = 'installed_app_id',
	app_id = 'app_id',
	account_id = 'account_id',
	user_id = 'user_id',
	name = 'name',
	active = 'active',
	created_at = 'created_at',
	updated_at = 'updated_at',
}

export enum InstalledAppsRelations {
	app = 'app',
	account = 'account',
	user = 'user',
}
