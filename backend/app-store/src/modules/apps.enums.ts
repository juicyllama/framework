export enum AppStoreIntegrationName {
	ahrefs = 'ahrefs',
	mollie = 'mollie',
	shopify = 'shopify',
	wordpress = 'wordpress',
	ga4 = 'ga4',
}

export enum AppIntegrationStatus {
	CONNECTED = 'CONNECTED',
	DISCONNCTED = 'DISCONNECTED',
}

export enum AppScope {
	ACCOUNT = 'ACCOUNT',
}

export enum AppIntegrationType {
	API_KEY = 'API_KEY',
	OAUTH2 = 'OAUTH2',
	CREDENTIALS = 'CREDENTIALS',
}

export enum AppCategory {
	accounting = 'accounting',
	communication = 'communication',
	crm = 'crm',
	cms = 'cms',
	ecommerce = 'ecommerce',
	payments = 'payments',
	seo = 'seo',
}

export enum AppInputType {
	text = 'text',
	dropdown = 'dropdown',
}

export enum AppInputValidationType {
	String = 'String',
	url = 'url',
}

export enum AppSelect {
	app_id = 'app_id',
	name = 'name',
	url = 'url',
	integration_type = 'integration_type',
	integration_name = 'integration_name',
	scopes = 'scopes',
	category = 'category',
	hexcode = 'hexcode',
	settings = 'settings',
	created_at = 'created_at',
}

export enum AppOrderBy {
	app_id = 'app_id',
	name = 'name',
	category = 'category',
	created_at = 'created_at',
}

export enum AppRelations {
	'parent' = 'parent',
	'children' = 'children'
}
